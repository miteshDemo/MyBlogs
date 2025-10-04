// routes/auth.js
import express from "express";
import { register, login, getMe } from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Test route for auth
router.get("/test", (req, res) => {
  res.json({ message: "Auth routes are working!" });
});

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login  
router.post("/login", login);

// GET /api/auth/me - Protected route
router.get("/me", authMiddleware, getMe);

export default router;