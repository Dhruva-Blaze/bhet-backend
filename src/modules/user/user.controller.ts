import { Request, Response, NextFunction } from "express";
import {
  createUserService,
  updateUserService,
  listUserService,
  deleteUserService
} from "./user.service";

// CREATE
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await createUserService(req.body);

    res.status(201).json({
      message: "User created successfully",
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE
export const updateUser = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await updateUserService(req.params.id, req.body);

    res.json({
      message: "User updated successfully",
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// LIST
export const listUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await listUserService(req.query);

    res.json({
      message: "Users fetched successfully",
      ...result
    });
  } catch (error) {
    next(error);
  }
};

// DELETE
export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await deleteUserService(req.params.id);

    res.json({
      message: "User deleted successfully",
      data: user
    });
  } catch (error) {
    next(error);
  }
};