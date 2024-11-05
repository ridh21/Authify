
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export const googleAuth = (req, res, next) => {
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })(req, res, next);
  };


export const googleCallback = passport.authenticate("google", {
    successRedirect: '/auth/google/success',
    failureRedirect: '/auth/google/failure'
  });
  
  export const handleGoogleSuccess = (req, res) => {
    const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
  
    const userData = {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      image: req.user.image,
      createdAt: req.user.createdAt
    };
  
    const encodedToken = encodeURIComponent(token);
    const encodedUser = encodeURIComponent(JSON.stringify(userData));
  
    res.redirect(`http://localhost:5173/welcome?token=${encodedToken}&user=${encodedUser}`);
  };
  
  export const handleGoogleFailure = (req, res) => {
    res.redirect('http://localhost:5173/login');
  };
  