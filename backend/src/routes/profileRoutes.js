import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import upload from '../middleware/uploadMiddleware.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', isAuthenticated, getProfile);
router.put('/update', isAuthenticated, upload.single('image'), updateProfile);

export default router;
