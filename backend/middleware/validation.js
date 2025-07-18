import { body, validationResult } from 'express-validator';

// Generic validation result handler
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: errors.array()
        });
    }
    next();
};

// User registration validation
export const validateUserRegistration = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),
    
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
    handleValidationErrors
];

// User login validation
export const validateUserLogin = [
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    
    handleValidationErrors
];

// Food item validation
export const validateFoodItem = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Food name must be between 2 and 100 characters'),
    
    body('description')
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage('Description must be between 10 and 500 characters'),
    
    body('price')
        .isFloat({ min: 0.01 })
        .withMessage('Price must be a positive number'),
    
    body('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required'),
    
    handleValidationErrors
];

// Order validation
export const validateOrder = [
    body('items')
        .isArray({ min: 1 })
        .withMessage('Order must contain at least one item'),
    
    body('items.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Item quantity must be a positive integer'),
    
    body('address')
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage('Address must be between 10 and 500 characters'),
    
    handleValidationErrors
];

// MongoDB ObjectId validation
export const validateObjectId = (paramName) => [
    body(paramName)
        .isMongoId()
        .withMessage(`${paramName} must be a valid MongoDB ObjectId`),
    
    handleValidationErrors
];