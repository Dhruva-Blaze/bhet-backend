import { generateToken } from "../../common/utils/jwt";
import { User } from "../user/user.model";
import bcrypt from "bcrypt";

export const loginService = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select("+password").lean();

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  if (user.status === "BLOCKED") {
    throw new Error("Your account has been blocked");
  }

  const token = generateToken({ id: user._id, role: user.role });

  return {
    user: { ...user, password: "[PASSWORD]" },
    token,
  };
};

export const adminLoginService = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select("+password").lean();

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (user.role !== "ADMIN") {
    throw new Error("Access denied. Admin privileges required.");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  if (user.status === "BLOCKED") {
    throw new Error("Your account has been blocked");
  }

  const token = generateToken({ id: user._id, role: user.role });

  return {
    user: { ...user, password: "[PASSWORD]" },
    token,
  };
};

export const registerService = async (payload: any) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new Error("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const user = await User.create({
    ...payload,
    password: hashedPassword,
    role: "ADMIN",
  });

  const token = generateToken({ id: user._id, role: user.role });

  return {
    user: { ...user.toObject(), password: "[PASSWORD]" },
    token,
  };
};
