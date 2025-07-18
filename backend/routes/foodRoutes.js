import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import { validateFoodItem } from "../middleware/validation.js";
import multer from "multer";
import path from "path";

const foodRouter = express.Router();

// Image Storage Engine with security improvements
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp and random string
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        return cb(null, `food-${uniqueSuffix}${fileExtension}`);
    }
});

// File filter for security
const fileFilter = (req, file, cb) => {
    // Allow only image files
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (JPEG, PNG, GIF) are allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1
    }
});

// Routes with validation and file upload
foodRouter.post("/add", upload.single("image"), validateFoodItem, addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);

export default foodRouter;