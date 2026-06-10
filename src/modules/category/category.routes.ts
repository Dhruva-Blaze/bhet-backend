import { Router } from "express";
import { validate } from "../../common/middlewares/validate";
import {
  createCategorySchema,
  deleteCategorySchema,
  listCategorySchema,
  updateCategorySchema,
} from "./category.validation";
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from "./category.controller";
import {
  getWebsiteCategories,
  getWebsiteFilters,
  getWebsiteSubcategories,
} from "./category.website.controller";
import { upload } from "../../common/middlewares/cloudinaryUpload";

const router = Router();

router.post("/", upload.single("bannerImage"), validate(createCategorySchema), createCategory);
router.put("/:id", upload.single("bannerImage"), validate(updateCategorySchema), updateCategory);
router.get("/", validate(listCategorySchema), listCategories);
router.delete("/:id", validate(deleteCategorySchema), deleteCategory);


// Website routes

router.get("/website", getWebsiteCategories);

// New endpoints for multi-select (query params: ?categoryIds=... and ?parentIds=...)
router.get("/website/filters", getWebsiteFilters);
router.get("/website/subcategories", getWebsiteSubcategories);

// Legacy single-select endpoints (backward compatibility)
router.get("/website/:categoryId/filter", getWebsiteFilters);
router.get("/website/:categoryId", getWebsiteSubcategories);

export default router;
