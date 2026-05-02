import sendOtp from "../utils/sendOtp.js";
import TryCatch from "../utils/tryCatch.js";
import { OTP } from "../models/Otp.js";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

export const loginUser = TryCatch(async (req, res) => {
  const { email } = req.body;

  const subject = "OTP for Account Verification";

  const otp = Math.floor(100000 + Math.random() * 900000);

  const prevOtp = await OTP.findOne({ email });

  if (prevOtp) {
    await prevOtp.deleteOne();
  }

  await sendOtp({
    email,
    subject,
    otp,
  });

  await OTP.create({ email, otp });

  res.json({
    message: "OTP sent to your mail",
  });
});

export const verifyOtp = TryCatch(async (req, res) => {
  const { email, otp } = req.body;

  const haveOtp = await OTP.findOne({ email, otp });

  if (!haveOtp) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({ email });
  }

  const token = jwt.sign(
    { _id: user._id },
    process.env.JWT_SEC,
    { expiresIn: "7d" }
  );

  await haveOtp.deleteOne();

  res.json({
    message: "Login successful",
    token,
    user,
  });
});

export const myProfile = TryCatch(async(req , res) => {
    const user = await User.findById(req.user._id);

    res.json(user);
});