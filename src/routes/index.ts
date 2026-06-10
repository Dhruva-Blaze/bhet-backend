import { Router } from "express";

import userRoutes from "../modules/user/user.routes";
import productRoutes from "../modules/product/product.routes";
import pricingRoutes from "../modules/pricing/pricing.routes";
import authRoutes from "../modules/auth/auth.routes";
import contactRoutes from "../modules/contact/contact.routes";
import categoryRoutes from "../modules/category/category.routes";
import filterGroupRoutes from "../modules/filter-group/filter-group.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/products/:productId/pricing", pricingRoutes);
router.use("/auth", authRoutes);
router.use("/contact", contactRoutes);
router.use("/categories", categoryRoutes);
router.use("/filter-groups", filterGroupRoutes);

export default router;
