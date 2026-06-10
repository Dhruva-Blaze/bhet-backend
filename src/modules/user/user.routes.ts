import { Router } from "express";
import { validate } from "../../common/middlewares/validate";
import { createUserSchema, listUserSchema, updateUserSchema, deleteUserSchema } from "./user.validation";
import { createUser, listUsers, updateUser, deleteUser } from "./user.controller";

const router = Router()

router.post("/", validate(createUserSchema), createUser)
router.put("/:id", validate(updateUserSchema), updateUser)
router.get("/", validate(listUserSchema), listUsers)
router.delete("/:id", validate(deleteUserSchema), deleteUser)

export default router
