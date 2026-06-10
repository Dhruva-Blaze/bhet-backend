import { NextFunction, Request, Response } from "express";
import {
  createCategoryService,
  deleteCategoryService,
  listCategoryService,
  updateCategoryService,
} from "./category.services";

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload: any = { ...req.body };

    // Attach uploaded banner image if present
    if (req.file) {
      payload.bannerImage = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const category = await createCategoryService(payload);

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload: any = { ...req.body };

    // Attach uploaded banner image if a new one was provided
    if (req.file) {
      payload.bannerImage = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const category = await updateCategoryService(
      req.params.id as string,
      payload,
    );

    return res.status(201).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const listCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await listCategoryService(req.query);

    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      ...categories,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const category = await deleteCategoryService(req.params.id as string);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};
