// user.types.ts

export type UserRole = "ADMIN" | "CLIENT" | "VENDOR" | "USER";
export type UserStatus = "ACTIVE" | "BLOCKED";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
}