import Student from "../models/student.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMailFunc from "../Email/transporter.js";
import dotenv from "dotenv";
dotenv.config();

const signup = async (req, res) => {
  const data = req.body;
  try {
    const existingStudent = await Student.findOne({ email: data.email });
    if (existingStudent) {
      return res.json({ status: false, message: "Student already registered" });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const student = new Student({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      class: data.class,
      board: data.board,
      medium: data.medium,
    });
    await student.save();
    res.json({ status: true, message: "Student registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

const login = async (req, res) => {
  const data = req.body;
  try {
    const student = await Student.findOne({ email: data.email });
    if (!student) {
      return res.json({ status: false, message: "Student not registered" });
    }

    const match = await bcrypt.compare(data.password, student.password);
    if (!match) {
      return res.json({ status: false, message: "Invalid password" });
    }

    const token = jwt.sign({ email: student.email }, process.env.JWT_KEY, {
      expiresIn: "24h",
    });
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Ensure secure cookies in production
        sameSite: "None", // Allows cross-site cookies; use 'Strict' or 'Lax' if not needed
        maxAge: 24 * 60 * 60 * 1000,
        path: "/", // Cookie will be sent for all routes
      })
      .json({ status: true, message: "Login successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  const data = req.body;
  try {
    const student = await Student.findOne({ email: data.email });
    if (!student) {
      return res.json({ status: false, message: "User doesn't exist!" });
    }

    const token = jwt.sign({ email: student.email }, process.env.JWT_KEY, {
      expiresIn: "5m",
    });
    sendMailFunc(data, token, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  const data = req.body;
  const token = req.params.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const student = await Student.findOne({ email: decoded.email });
    if (!student) {
      return res.json({ status: false, message: "User doesn't exist!" });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    await Student.updateOne(
      { email: decoded.email },
      { $set: { password: hashedPassword } }
    );
    res.json({ status: true, message: "Password updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

export { signup, login, forgotPassword, resetPassword };
