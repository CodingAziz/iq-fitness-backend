
import { RefreshSession } from '../models/refreshSession.model.js';
import { OTP } from '../models/otp.model.js';
import { createSecretToken } from '../utils/token.utils.js';
import jwt from 'jsonwebtoken'
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { User } from '../models/user.model.js';

// OTP CONSTANTS
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 min
const RESEND_COOLDOWN_MS = 30 * 1000; // 30 seconds
const MAX_RESEND_ATTEMPTS = 5 // max resends
const RESEND_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_VERIFY_ATTEMPTS = 5; // max attempts

// TOKEN CONSTANTS
const THIRTY_DAYS_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const ONE_DAY_EXPIRY_MS = 1 * 24 * 60 * 60 * 1000; // 1 day

export const login = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
                isNewUser: false,
            });
        }

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found. Please sign up.",
            });
        }

        req.email = email;

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
} 

export const signup = async (req, res, next) => {
    try {
        const { fullName, phone, email } = req.body;
        if (!fullName | !phone | !email) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please log in",
            });
        }

        req.email = email;

        next();
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

export const sendOtp = async (req, res) => {
  try {
    const email = req.email;
    if (!email) {
        return res.status(400).json({
            message: "Email is required",
            success: false,
        })
    }
        
    const otp = crypto.randomInt(100000, 1000000).toString();

    const existingOtp = await OTP.findOne({ email: email });
    if (existingOtp) {
        const windowAge = Date.now() - existingOtp.createdAt.getTime();
        if (windowAge >= RESEND_WINDOW_MS) {
            existingOtp.resendCounts = 0;
            existingOtp.createdAt = new Date();
        }

        const timeSinceLastOtp = Date.now() - existingOtp.updatedAt.getTime();
        if (timeSinceLastOtp < RESEND_COOLDOWN_MS) {
            const remainingCooldownTime = Math.ceil((RESEND_COOLDOWN_MS - timeSinceLastOtp) / 1000);
            return res.status(429).json({
                message: `Please wait ${remainingCooldownTime} seconds before requesting another otp.`,
            })
        }

        if (existingOtp.resendCounts >= MAX_RESEND_ATTEMPTS) {
            const remainingResendTime = Math.ceil((RESEND_WINDOW_MS - windowAge)/1000);
            return res.status(429).json({ 
                success: false, 
                message: `Maximum OTP resend attempts reached. Please try again after ${remainingResendTime} seconds before requesting another otp.`
            });
        }

        existingOtp.otpHash = crypto.createHash("SHA256").update(otp).digest("hex");
        existingOtp.verifyAttempts = 0;
        existingOtp.expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);
        existingOtp.resendCounts += 1;

        await existingOtp.save();
    } else {
        const newOtpEntry = await OTP.create({
            email: email,
            otpHash: crypto.createHash("SHA256").update(otp).digest("hex"),
            expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
        });
    }

    console.log(`[INFO] OTP GENERATED: ${otp}`);

    // NODEMAILER CONFIG
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    try {
      await transporter.verify();
      console.log(`SMTP Connection successfull`);
    } catch (error) {
      console.error(error);
    }
 
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your IQ Fitness Verification Code",
      html: `
        <div style="max-width:500px;margin:auto;padding:24px;font-family:Arial,sans-serif;background:#ffffff;border:1px solid #e5e5e5;border-radius:8px;">
          <h2 style="color:#1975E7;margin-top:0;">IQ Fitness</h2>

          <p>Hello,</p>

          <p>Use the following OTP to verify your email address:</p>

          <div style="margin:24px 0;text-align:center;">
            <span style="display:inline-block;padding:12px 24px;font-size:28px;font-weight:bold;letter-spacing:6px;background:#f4f8ff;color:#1975E7;border-radius:6px;">
              ${otp}
            </span>
          </div>

          <p>This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>

          <p style="margin-top:24px;">Regards,<br><strong>Amaztronics Team</strong></p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent successfully`);
  
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const {fullName, phone, email, otp } = req.body;
    if (!otp) {
      return res.status(404).json({
        success: false,
        message: "Email or OTP not found"
      });
    };

    const existingOtp = await OTP.findOne({ email: email });
    if (!existingOtp) {
      return res.status(404).json({
        success: false,
        message: "OTP not found",
      })
    };

    if (existingOtp.expiresAt.getTime() < Date.now()) {
      await OTP.deleteOne({ email: email });
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    if (crypto.createHash("SHA256").update(otp).digest("hex") != existingOtp.otpHash) {
      existingOtp.verifyAttempts += 1
      if (existingOtp.verifyAttempts >= MAX_VERIFY_ATTEMPTS) {
        await OTP.deleteOne({ _id: existingOtp._id });
      } else {
        await existingOtp.save();
      }
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      })
    }

    await OTP.deleteOne({ email: email });

    let user;
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      user = await User.create({
        fullName: fullName,
        phone: phone,
        email: email,
      });
    } else {
      user = existingUser;
    }

    const session = await RefreshSession.create({ 
      userId: user._id,
      expiresAt: new Date(Date.now() + THIRTY_DAYS_EXPIRY_MS),
    });
    const { accessToken, refreshToken } = createSecretToken(user._id, session._id);
    const hashedToken = crypto.createHash("SHA256").update(refreshToken).digest("hex");
    session.tokenHash = hashedToken;
    await session.save();

    return res.status(201).send({
      success: true,
      message: "OTP Verified",
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      }
    });
  } catch(error) {
    console.log(error);
    return res.status(500).send({
      message: "Something went wrong!",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.headers["x-refresh-token"];
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Token not found"
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY)

    const hashedToken = crypto.createHash("SHA256").update(refreshToken).digest("hex");
    const existingToken = await RefreshSession.findOne({ tokenHash: hashedToken });
    if (!existingToken) {
      return res.status(401).json({
        success: false,
        message: "Token not found",
      });
    }
    await RefreshSession.deleteOne({ _id: existingToken._id });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    })
  } catch(error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    })
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.headers["x-refresh-token"];
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh Token not found",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
    const userId = decoded.userId;
    const sessionId = decoded.sessionId;

    const existingSession = await RefreshSession.findById(sessionId);
    if (!existingSession) {
      return res.status(401).json({
        success: false,
        message: "Session does not exist"
      })
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ 
        message: "Invalid token", 
        success: false 
      });
    }


    if (Date.now() > existingSession.expiresAt) {
      await RefreshSession.deleteOne({ _id: existingSession._id });

      return res.status(401).json({
        success: false,
        message: "Session Expired",
      })
    }

    const hashedToken = crypto.createHash("SHA256").update(refreshToken).digest("hex");

    if (existingSession.tokenHash !== hashedToken) {
      await RefreshSession.deleteOne({ _id: existingSession._id });
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }

    const { accessToken, refreshToken: newRefreshToken } = createSecretToken(userId, existingSession._id);

    existingSession.tokenHash = crypto.createHash("SHA256").update(newRefreshToken).digest("hex");
    existingSession.expiresAt = new Date(Date.now() + THIRTY_DAYS_EXPIRY_MS);

    await existingSession.save();

    res.status(200).json({
      success: true,
      message: "refresh has been successfull",
      data: {
        accessToken: accessToken,
        refreshToken: newRefreshToken,
      }
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: "Token Expired",
        success: false,
      });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: "Invalid token structure or signature",
        success: false,
      });
    }
    if (error instanceof jwt.NotBeforeError) {
      return res.status(401).json({
        message: "Token not active yet",
        success: false,
      });
    }
    console.error(error);
    return res.status(500).json({ 
      message: "Internal Server Error", 
      success: false 
    });
  }
};
