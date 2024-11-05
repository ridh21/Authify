import { Router } from "express";
import * as authController from '../controllers/authController.js';

import upload from "../middleware/uploadMiddleware.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/signup", upload.single("image"), authController.signup);
router.post("/login", authController.login);
router.post("/verify-email", authController.verifyEmail);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Google OAuth routes
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);


router.get("/verify", isAuthenticated, (req, res) => {
  res.json({ isAuthenticated: true, user: req.user });
});

export default router;
