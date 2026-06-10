import { Router } from "express";

import {
  createFilterOption,
  updateFilterOption,
  listFilterOptions,
} from "./filter-option.controller";

import { validate } from "../../common/middlewares/validate";
import {
  createFilterOptionSchema,
  updateFilterOptionSchema,
  listFilterOptionSchema,
} from "./filter-option.validation";

const router = Router();

router.post("/", validate(createFilterOptionSchema), createFilterOption);

router.put("/:id", validate(updateFilterOptionSchema), updateFilterOption);

router.get("/", validate(listFilterOptionSchema), listFilterOptions);

export default router;
