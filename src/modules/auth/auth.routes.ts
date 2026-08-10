import { Router } from "express";
import { login, register, adminLogin, updateAdmin } from "./auth.controller";
import { validate } from "../../common/middlewares/validate";
import { loginSchema, registerSchema } from "./auth.validation";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.post("/admin/login", validate(loginSchema), adminLogin);
router.put("/admin/:id", updateAdmin);
router.post("/register", validate(registerSchema), register);

export default router;
