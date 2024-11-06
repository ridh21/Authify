import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { promisify } from "util";
const unlinkAsync = promisify(fs.unlink);
import passport from "../config/passport.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use absolute path for uploads directory
const uploadsDir = path.join(process.cwd(), "uploads");

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let imageUrl = "https://ui-avatars.com/api/?background=random";

    if (req.file) {
      // Use absolute path for file operations
      const filePath = path.join(uploadsDir, req.file.filename);
      const result = await cloudinary.uploader.upload(filePath);
      imageUrl = result.secure_url;

      // Delete local file after successful upload
      try {
        await unlinkAsync(filePath);
      } catch (error) {
        console.log('File already removed or does not exist');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        image: imageUrl,
        otp,
        otpExpiresAt,
      },
    });

    await sendVerificationEmail(email, otp);

    res.status(201).json({
      message:
        "Registration successful. Please check your email for verification.",
      userId: user.id,
      imageUrl,
    });
  } catch (error) {
    if (req.file) {
      const filePath = path.join(uploadsDir, req.file.filename);
      try {
        await unlinkAsync(filePath);
      } catch (unlinkError) {
        console.log('File already removed or does not exist');
      }
    }
    res.status(500).json({ error: error.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.emailVerified) {
      return res.status(403).json({ error: "Please verify your email first" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        otp: null,
        otpExpiresAt: null,
      },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      message: "Email verified successfully",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const sendVerificationEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    html: generateOTPEmailTemplate(otp),
  });
};

const generateOTPEmailTemplate = (otp) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #4F46E5; padding: 20px; text-align: center; color: white;">
        <h1>Verify Your Email</h1>
      </div>
      <div style="padding: 20px; background-color: #f9fafb; border-radius: 8px; margin-top: 20px;">
        <p style="font-size: 16px;">Your verification code is:</p>
        <div style="background-color: white; padding: 15px; border-radius: 4px; text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; letter-spacing: 8px;">${otp}</span>
        </div>
        <p style="color: #6b7280; font-size: 14px;">This code will expire in 10 minutes.</p>
      </div>
    </div>
  `;
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
      where: { email },
      data: { otp, otpExpiresAt },
    });

    await sendVerificationEmail(email, otp);
    res.json({ message: "Password reset OTP sent successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        otp: null,
        otpExpiresAt: null,
      },
    });

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// export const googleCallback = (req, res, next) => {
//   passport.authenticate('google', async (err, user) => {
//     if (err || !user) {
//       return res.redirect('http://localhost:5173/login');
//     }

//     try {
//       const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
//         expiresIn: '24h'
//       });

//     const userData = {
//       id: user.id,
//       username: user.username,
//       email: user.email,
//       image: user.image || profile.photos[0].value,
//       createdAt: user.createdAt
//     };

//     req.session.user = userData;
//     req.session.token = token;

//     const encodedToken = encodeURIComponent(token);
//     const encodedUser = encodeURIComponent(JSON.stringify(userData));

//     return res.redirect(`http://localhost:5173/welcome?token=${encodedToken}&user=${encodedUser}`);
//   } catch (error) {
//     return res.redirect('http://localhost:5173/login');
//   }
// })(req, res, next);
// };

export const googleCallback = (req, res, next) => {
  passport.authenticate("google", async (err, user) => {
    if (err || !user) {
      return res.redirect("http://localhost:5173/login");
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      image: user.image || profile.photos[0].value,
      createdAt: user.createdAt,
    };

    // console.log('User data before redirect:', userData); // Debug log

    const encodedToken = encodeURIComponent(token);
    const encodedUser = encodeURIComponent(JSON.stringify(userData));

    res.redirect(
      `http://localhost:5173/welcome?token=${encodedToken}&user=${encodedUser}`
    );
  })(req, res, next);
};

export const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        image: true,
        createdAt: true
      }
    });
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.status(200).json({ 
      isAuthenticated: true,
      user 
    });
  } catch (error) {
    res.status(401).json({ 
      isAuthenticated: false,
      error: "Invalid token" 
    });
  }
};