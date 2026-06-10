const cloudinaryStorage = require("multer-storage-cloudinary");
import cloudinary from "../../config/cloudinary";
import multer from "multer";

const storage = new cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "products",
    allowedFormats: ["jpg", "jpeg", "png", "webp"],
    filename: (req: any, file: any, cb: any) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 10 // allow up to 10 files
    } 
});
