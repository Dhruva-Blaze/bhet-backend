import { Request, Response, NextFunction } from "express";

import {
  createFilterOptionService,
  updateFilterOptionService,
  listFilterOptionService,
} from "./filter-option.service";

export const createFilterOption = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await createFilterOptionService(req.body);

    res.status(201).json({
      success: true,
      message: "Filter option created successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateFilterOption = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await updateFilterOptionService(
      req.params.id as string,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Filter option updated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const listFilterOptions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await listFilterOptionService(
      req.query.filterGroupId as string,
    );

    res.status(200).json({
      success: true,
      message: "Filter options fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
