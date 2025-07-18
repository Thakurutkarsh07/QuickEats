import express from "express";
import { addToCart, removeFromCart, getCart } from "../controllers/cartController.js";
import authMiddleware from "../middleware/auth.js";
import { body } from "express-validator";
import { handleValidationErrors } from "../middleware/validation.js";

const cartRouter = express.Router();

// Validation for cart operations
const validateCartItem = [
    body('itemId')
        .isMongoId()
        .withMessage('Invalid item ID'),
    handleValidationErrors
];

// Creating API endpoints with validation
cartRouter.post("/add", authMiddleware, validateCartItem, addToCart);
cartRouter.post("/remove", authMiddleware, validateCartItem, removeFromCart);
cartRouter.post("/get", authMiddleware, getCart);

export default cartRouter;