import express from "express";
import { loginUser, verifyOtp, myProfile } from "../controller/user.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/user/login", loginUser);
router.post("/user/verify", verifyOtp);
router.get("/user/me", isAuth, myProfile);

export default router;