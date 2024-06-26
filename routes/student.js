import express from "express";
import Student from "../models/student.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
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

const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
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
  res.json({ status: true, message: "User verified" });
});

router.get("/data", verifyUser, (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    Student.find({ email: decoded.email }).then((student) => {
      res.json({
        email: decoded.email,
        name: student[0].name,
        class: student[0].class,
        board: student[0].board,
        medium: student[0].medium,
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
  res.clearCookie("token").json({ status: true, message: "logged out" });
});

export default router;
