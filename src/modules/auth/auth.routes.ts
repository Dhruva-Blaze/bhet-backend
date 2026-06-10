import { Router } from "express";
import { login, register, adminLogin } from "./auth.controller";
import { validate } from "../../common/middlewares/validate";
import { loginSchema, registerSchema } from "./auth.validation";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.post("/admin/login", validate(loginSchema), adminLogin);
router.post("/register", validate(registerSchema), register);

export default router;
