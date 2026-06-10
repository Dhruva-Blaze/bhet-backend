import { NextFunction, Request, Response } from "express";
import {
  createFilterGroupService,
  listFilterGroupService,
  updateFilterGroupService,
  deleteFilterGroupService,
  getFiltersBySubcategoriesService,
} from "./filter-group.service";

export const createFilterGroup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await createFilterGroupService(req.body);
    res.status(201).json({
      success: true,
      message: "Filter group created successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const listFilterGroups = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await listFilterGroupService(req.query);

    res.status(200).json({
      message: "Filter groups fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateFilterGroup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await updateFilterGroupService(req.params.id as string, req.body);
    res.status(200).json({
      success: true,
      message: "Filter group updated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFilterGroup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await deleteFilterGroupService(req.params.id as string);
    res.status(200).json({
      success: true,
      message: "Filter group deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getFiltersBySubcategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { subCategoryIds } = req.body;

    const data = await getFiltersBySubcategoriesService(subCategoryIds || []);

    return res.status(200).json({
      success: true,
      message: "Filters fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
