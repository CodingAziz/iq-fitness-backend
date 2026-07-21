import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader | !authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access Token missing"
      })
    }

    const accessToken = authHeader.split(" ")[1];
    const decoded = jwt.verify(accessToken, process.env.TOKEN_KEY);
    const user = await User.findOne({ _id: decoded.userId });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.userId = user._id

    next();
  } catch(error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
