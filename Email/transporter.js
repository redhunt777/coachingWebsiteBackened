import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

function sendMailFunc(data, token, res) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.G_USER,
      pass: process.env.G_PASS,
    },
  });

  const mailOptions = {
    from: process.env.G_USER,
    to: data.email,
    subject: "Password reset link from akshay classes",
    text: `Do not share this link to anyone, Click on the link to reset your password ${process.env.CORS_URL}/resetPassword/${token}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return res.json({ status: false, message: "error sending mail" });
    } else {
      return res.json({ status: true, message: "email sent" });
    }
  });
}

export default sendMailFunc;
