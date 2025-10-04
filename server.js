// server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Remove CSP headers
app.use((req, res, next) => {
  res.removeHeader('Content-Security-Policy');
  next();
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "API is working!",
    timestamp: new Date().toISOString(),
    availableRoutes: [
      "POST /api/auth/register",
      "POST /api/auth/login", 
      "GET /api/auth/me"
    ]
  });
});

// Routes
app.use("/api/auth", authRoutes);

// Catch-all middleware for 404 - NO WILDCARD PATTERNS
app.use((req, res, next) => {
  // Check if this is an API route that wasn't handled
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({ 
      message: `API route not found: ${req.originalUrl}`,
      availableRoutes: [
        "GET /api/test",
        "POST /api/auth/register",
        "POST /api/auth/login",
        "GET /api/auth/me"
      ]
    });
  }
  
  // For non-API routes
  res.status(404).json({ 
    message: `Route not found: ${req.originalUrl}`,
    note: "API routes are available under /api"
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ 
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// MongoDB connection
const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/myblog";

mongoose.connect(MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  console.log("✅ MongoDB connected successfully");
  console.log(`📊 Database: ${MONGODB_URI}`);
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
  console.log("💡 Make sure MongoDB is running on localhost:27017");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🔍 Test the API: http://localhost:${PORT}/api/test`);
});