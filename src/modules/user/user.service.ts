import { User } from "./user.model";
import { IUser } from "./user.types";
import bcrypt from "bcrypt";

export const createUserService = async (payload: IUser) => {
  const { name, email, password, role, status } = payload;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    status,
  });

  return user;
};

export const updateUserService = async (
  userId: string,
  payload: Partial<IUser>,
) => {
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(userId, payload, { new: true });

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};

export const listUserService = async (query: any) => {
  const { page = 1, limit = 10, role, status, search } = query;

  const filter: any = {};

  if (role) filter.role = role;
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean(),

    User.countDocuments(filter),
  ]);
  return {
    data,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
    },
  };
};

export const deleteUserService = async (userId: string) => {
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new Error("User not found");
  }
  return deletedUser;
};
