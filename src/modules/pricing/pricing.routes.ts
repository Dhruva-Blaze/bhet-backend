import { Router } from "express";
import { upsertPricing } from "./pricing.controller";
import { validate } from "../../common/middlewares/validate";
import { upsertPricingSchema } from "./pricing.validation";

const router = Router({ mergeParams: true });

// UPSERT pricing
router.put("/", validate(upsertPricingSchema), upsertPricing);

export default router;
