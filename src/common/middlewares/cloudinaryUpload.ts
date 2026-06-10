import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../config/cloudinary";
import multer from "multer";

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req: any, file: any) => ({
        folder: "products",
        allowed_formats: ["jpeg", "jpg", "png", "webp"],
        public_id: `${Date.now()}-${file.originalname}`
    })
})

export const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 10 // allow up to 10 files
    } 
});
