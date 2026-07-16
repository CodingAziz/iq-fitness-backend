import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const requireSignIn = async (req, res, next) => {
  try {
    const accessToken = req.headers.Authorization;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Access token missing",
      });
    }

    const decoded = jwt.verify(accessToken, process.env.TOKEN_KEY);

    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = {
      id: user._id,
    };


  } catch(error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
