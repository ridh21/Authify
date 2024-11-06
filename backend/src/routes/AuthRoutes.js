import { Router } from "express";
import {
  login,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  googleAuth,
  googleCallback,
  verifyToken,
} from "../controllers/authController.js";
import upload from "../middleware/uploadMiddleware.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = Router();

// Signup route
router.post("/signup", upload.single("image"), signup);

// Login route
router.post("/login", login);

// Email verification routes
router.post("/verify-email", verifyEmail);

// Forgot password routes
router.post("/forgot-password", forgotPassword);

// Reset password routes
router.post("/reset-password", resetPassword);

// Verify email route
router.post("/verify", verifyEmail);

// Verify token route
router.get("/verify-token", verifyToken);

// Google OAuth routes
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

export default router;
