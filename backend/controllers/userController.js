import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User Doesn't Exist" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate token
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);  // Log internal errors
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Create Token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: "2d" });
};

// Register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    // Validate strong password
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ success: false, message: "Please enter a strong password" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);  // Log internal errors
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { registerUser, loginUser };
