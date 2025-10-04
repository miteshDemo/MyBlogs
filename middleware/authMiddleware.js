// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mitesh123");
    req.user = decoded; // { userId: user._id }
    next();
  } catch (err) {
    console.error("❌ Token verification error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
}