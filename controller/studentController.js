import Student from "../models/student.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMailFunc from "../Email/transporter.js";
import dotenv from "dotenv";
dotenv.config();

const signup = async (req, res) => {
  {
    const data = req.body;
    Student.find({ email: data.email }).then((student) => {
      if (student.length) {
        res.json({ message: "Student already registered" });
      } else {
        bcrypt.hash(data.password, 10, (err, hash) => {
          const student = new Student({
            name: data.name,
            email: data.email,
            password: hash,
            class: data.class,
            board: data.board,
            medium: data.medium,
          });
          student.save();
          res.json({
            status: true,
            message: "Student registered successfully",
          });
        });
      }
    });
  }
};

const login = async (req, res) => {
  const data = req.body;
  await Student.find({ email: data.email }).then((student) => {
    if (student.length) {
      bcrypt.compare(data.password, student[0].password, (err, result) => {
        if (result) {
          const token = jwt.sign(
            { email: student[0].email },
            process.env.JWT_KEY,
            {
              expiresIn: "24h",
            }
          );
          res
            .cookie("token", token, {
              httpOnly: true,
              maxAge: 24 * 60 * 60 * 1000,
            })
            .json({ status: true, message: "Login successful" });
        } else {
          res.json({ status: false, message: "Invalid password" });
        }
      });
    } else {
      res.json({ status: false, message: "Student not registered" });
    }
  });
};

const forgotPassword = async (req, res) => {
  const data = req.body;
  try {
    const student = await Student.find({ email: data.email });
    if (!student.length) {
      console.log("User Doesn't Exist!");
      return res.json({ status: false, message: "User Doesn't Exist!" });
    } else {
      const token = jwt.sign({ email: student[0].email }, process.env.JWT_KEY, {
        expiresIn: "5m",
      });
      sendMailFunc(data, token, res);
    }
  } catch (err) {
    console.log(err);
  }
};

const resetPassword = async (req, res) => {
  const data = req.body;
  const token = req.params.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const student = await Student.find({ email: decoded.email });
    if (!student.length) {
      console.log("User Doesn't Exist!");
      return res.json({ status: false, message: "User Doesn't Exist!" });
    } else {
      bcrypt.hash(data.password, 10, (err, hash) => {
        Student.updateOne(
          { email: decoded.email },
          { $set: { password: hash } }
        ).then(res.json({ status: true, message: "password updated" }));
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export { signup, login, forgotPassword, resetPassword };
