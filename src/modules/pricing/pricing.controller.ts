import { Request, Response, NextFunction } from "express";
import { upsertPricingService } from "./pricing.services";

export const upsertPricing = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const { pricing } = req.body;

    await upsertPricingService(productId as string, pricing);

    res.json({
      message: "Pricing updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
