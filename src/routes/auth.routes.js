import e from "express";
import { login, signup, sendOtp, logout, refresh } from "../controllers/auth.controller";

const router = e.router();

router.post("/login", login, sendOtp);
router.post("/signup", signup, sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/logout", logout);
router.post("/refresh", refresh);