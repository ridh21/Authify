import express from "express";
import cors from "cors";
import authRoutes from "./routes/AuthRoutes.js";
import profileRoutes from './routes/profileRoutes.js';
import passport from "passport";
import cookieParser from "cookie-parser";
import session from 'express-session';
import events from 'events';
events.EventEmitter.defaultMaxListeners = 15;

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set to true in production with HTTPS
}));




app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());


app.use("/api/auth", authRoutes);
app.use('/api/profile', profileRoutes);


app.get("/", (req, res) => {
  res.send("Hello, World!");
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
