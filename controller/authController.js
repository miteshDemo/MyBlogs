// controllers/authController.js
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    console.log("📨 Register request received:", { name, email, password });

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: "All fields are required: name, email, password" 
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with hashed password
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword 
    });

    console.log("✅ User created successfully:", user.email);

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "mitesh123",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      },
      token,
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("🔐 Login attempt for:", email);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "mitesh123",
      { expiresIn: "7d" }
    );

    console.log("✅ Login successful for:", user.email);

    res.json({
      message: "Login successful",
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      },
      token,
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    console.error("❌ GetMe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};