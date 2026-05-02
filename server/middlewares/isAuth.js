import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Please login",
      });
    }

    const token = authHeader.split(" ")[1]; // remove "Bearer"

    const decoded = jwt.verify(token, process.env.JWT_SEC);

    req.user = await User.findById(decoded._id);

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Please login",
    });
  }
};