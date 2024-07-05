import express from "express";
import Student from "../models/student.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import otplib from "otplib";
import { sendOtpFunc } from "../Email/transporter.js";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
} from "../controller/studentController.js";

dotenv.config();
const router = express.Router();

router.post("/signup", (req, res) => signup(req, res));
router.post("/login", (req, res) => login(req, res));
router.post("/forgotPassword", (req, res) => forgotPassword(req, res));
router.post("/resetPassword/:token", async (req, res) =>
  resetPassword(req, res)
);

let otpStore = {}; // In-memory store for OTPs (for demo purposes)

// Ensure otplib is correctly configured
otplib.authenticator.options = {
  step: 30, // The time step used for generating the OTP (default is 30 seconds)
  window: 1, // The allowable window for OTP verification (default is 1)
  digits: 6,
  algorithm: "sha1", // The algorithm used for OTP generation (default is 'SHA-1')
};

router.post("/generate-otp", async (req, res) => {
  const { email } = req.body;

  // Check if the email is already registered
  const student = await Student.findOne({ email });
  if (student) {
    return res.json({ status: false, message: "Student already registered" });
  }

  const secret = otplib.authenticator.generateSecret();
  const otp = otplib.authenticator.generate(secret);

  // Store the OTP and secret for verification
  otpStore[email] = { otp, secret };

  console.log(`Generated OTP for ${email}: ${otp}`);
  console.log(`Secret for ${email}: ${secret}`);

  // Send the OTP via email
  sendOtpFunc(email, otp, res);
});

router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  // Check if the OTP is stored
  if (!otpStore[email]) {
    return res.json({
      status: false,
      message: "OTP not found or email invalid",
    });
  }

  const { secret } = otpStore[email];

  console.log(`Verifying OTP for ${email}: ${otp}`);
  console.log(`Stored Secret for ${email}: ${secret}`);

  const isValid = otplib.authenticator.check(otp, secret);

  console.log(`OTP Valid: ${isValid}`);

  if (isValid) {
    delete otpStore[email]; // Clear the OTP after successful validation
    res.json({ status: true, message: "OTP verified" });
  } else {
    res.json({ status: false, message: "Invalid OTP" });
  }
});

const verifyUser = async (req, res, next) => {
  const token = req.cookies.token;
  try {
    if (!token) {
      return res.json({ status: false, message: "Token not found" });
    }
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        return res.json({ status: false, message: "Invalid token" });
      }
      next();
    });
  } catch (err) {
    console.log(err);
  }
};

router.get("/verify", verifyUser, (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    Student.find({ email: decoded.email }).then((student) => {
      res.json({
        email: decoded.email,
        name: student[0].name,
        class: student[0].class,
        board: student[0].board,
        medium: student[0].medium,
        status: true,
        message: "User verified",
      });
    });
  });
});

router.patch("/update", verifyUser, (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    Student.findOneAndUpdate(
      { email: decoded.email },
      {
        name: req.body.name,
        class: req.body.class,
        board: req.body.board,
        medium: req.body.medium,
      }
    ).then(() => {
      res.json({ status: true, message: "Data updated", data: req.body });
    });
  });
});

router.get("/logout", (req, res) => {
  console.log("logout");
  res
    .clearCookie("token", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None", // Adjust as per your needs
    })
    .json({ status: true, message: "logged out" });
});

export default router;
