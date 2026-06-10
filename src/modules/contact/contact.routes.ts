import { Router } from "express";
import { 
  createContact,
  listAdminContacts,
  getAdminContact,
  updateAdminContactStatus,
  deleteAdminContact
} from "./contact.controller";
import { validate } from "../../common/middlewares/validate";
import { contactSchema } from "./contact.validation";
import { authenticate } from "../../common/middlewares/auth";
import { authorize } from "../../common/middlewares/authorize";

const router = Router();

// Public route for creating an inquiry
router.post("/", validate(contactSchema), createContact);

// Admin routes
router.get("/admin/", authenticate, authorize("ADMIN"), listAdminContacts);
router.get("/admin/:id", authenticate, authorize("ADMIN"), getAdminContact);
router.patch("/admin/:id/status", authenticate, authorize("ADMIN"), updateAdminContactStatus);
router.delete("/admin/:id", authenticate, authorize("ADMIN"), deleteAdminContact);

export default router;
