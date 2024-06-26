import express from "express";
import dotenv from "dotenv";
import Ncert from "../models/ncert.js";
dotenv.config();

const router = express.Router();

router.get("/english/11", (req, res) => {
  try {
    Ncert.find({ class: 11, medium: "english" }).then((ncert) => {
      res.json(ncert);
    });
  } catch (error) {
    res.status;
  }
});

router.get("/english/12", (req, res) => {
  try {
    Ncert.find({ class: 12, medium: "english" }).then((ncert) => {
      res.json(ncert);
    });
  } catch (error) {
    res.status;
  }
});

router.get("/hindi/11", (req, res) => {
  try {
    Ncert.find({ class: 11, medium: "hindi" }).then((ncert) => {
      res.json(ncert);
    });
  } catch (error) {
    res.status;
  }
});

router.get("/hindi/12", (req, res) => {
  try {
    Ncert.find({ class: 12, medium: "hindi" }).then((ncert) => {
      res.json(ncert);
    });
  } catch (error) {
    res.status;
  }
});

export default router;
