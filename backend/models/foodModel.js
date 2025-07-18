import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Food name is required'],
        minlength: [2, 'Food name must be at least 2 characters long'],
        maxlength: [100, 'Food name cannot exceed 100 characters'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [10, 'Description must be at least 10 characters long'],
        maxlength: [500, 'Description cannot exceed 500 characters'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0.01, 'Price must be greater than 0'],
        max: [10000, 'Price cannot exceed 10000']
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
        enum: {
            values: ['Salad', 'Rolls', 'Deserts', 'Sandwich', 'Cake', 'Pure Veg', 'Pasta', 'Noodles'],
            message: 'Category must be one of: Salad, Rolls, Deserts, Sandwich, Cake, Pure Veg, Pasta, Noodles'
        }
    }
}, {
    timestamps: true // Add created/updated timestamps
});

// Add indexes for better performance
foodSchema.index({ category: 1 });
foodSchema.index({ name: 'text', description: 'text' }); // Text search

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;