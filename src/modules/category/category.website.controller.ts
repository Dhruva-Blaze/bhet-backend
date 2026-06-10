import {
  getWebsiteCategoriesService,
  getWebsiteFiltersService,
  getWebsiteSubcategoriesService,
} from "./category.website.service";
import { Request, Response, NextFunction } from "express";

export const getWebsiteCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getWebsiteCategoriesService();

    res.status(200).json({
      message: "Categories fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getWebsiteSubcategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parentIds = req.query.parentIds 
      ? (req.query.parentIds as string).split(",").filter(Boolean) 
      : [];
    if (parentIds.length === 0 && req.params.categoryId) {
      parentIds.push(req.params.categoryId as string);
    }

    const data = await getWebsiteSubcategoriesService(parentIds);

    res.status(200).json({
      message: "Subcategories fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getWebsiteFilters = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categoryIds = req.query.categoryIds 
      ? (req.query.categoryIds as string).split(",").filter(Boolean) 
      : [];
    if (categoryIds.length === 0 && req.params.categoryId) {
      categoryIds.push(req.params.categoryId as string);
    }

    const data = await getWebsiteFiltersService(categoryIds);

    return res.status(200).json({
      success: true,
      message: "Filters fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
