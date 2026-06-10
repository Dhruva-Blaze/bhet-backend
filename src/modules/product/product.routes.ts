import { Router } from "express";
import {
  createProduct,
  updateProduct,
  listProducts,
  getProduct,
  listAdminProducts,
  getAdminProduct,
  deleteProduct,
} from "./product.controller";

import { validate } from "../../common/middlewares/validate";
import { optionalAuthenticate } from "../../common/middlewares/auth";
import {
  createProductSchema,
  updateProductSchema,
  listProductSchema,
  getProductSchema,
} from "./product.validation";

import { authenticate } from "../../common/middlewares/auth";
import { authorize } from "../../common/middlewares/authorize";
import { upload } from "../../common/middlewares/cloudinaryUpload";

const router = Router();

// Admin routes (Create, Update, List, Get)
router.post("/admin/", authenticate, authorize("ADMIN"), upload.array("images", 10), validate(createProductSchema), createProduct);
router.put("/admin/:id", authenticate, authorize("ADMIN"), upload.array("images", 10), validate(updateProductSchema), updateProduct);
router.get("/admin/:id", authenticate, authorize("ADMIN"), validate(getProductSchema), getAdminProduct);
router.get("/admin/", authenticate, authorize("ADMIN"), validate(listProductSchema), listAdminProducts);
router.delete("/admin/:id", authenticate, authorize("ADMIN"), validate(getProductSchema), deleteProduct);

// Website routes (List, Get)
router.get("/v1/:id", optionalAuthenticate, validate(getProductSchema), getProduct);
router.get("/v1/", optionalAuthenticate, validate(listProductSchema), listProducts);

export default router;
