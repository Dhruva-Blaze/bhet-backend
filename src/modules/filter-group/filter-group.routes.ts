import { Router } from "express";

import { createFilterGroup, listFilterGroups, updateFilterGroup, deleteFilterGroup, getFiltersBySubcategories } from "./filter-group.controller";
import { validate } from "../../common/middlewares/validate";
import { createFilterGroupSchema } from "./filter-group.validation";

const router = Router();

router.post("/", validate(createFilterGroupSchema), createFilterGroup);

router.get("/", listFilterGroups);

router.put("/:id", updateFilterGroup);

router.delete("/:id", deleteFilterGroup);

router.post("/by-subcategories", getFiltersBySubcategories);

export default router;
