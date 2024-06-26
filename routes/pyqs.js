import express from "express";
import Pyq from "../models/pyqs.js";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

router.get("/rbse/english/11", async (req, res) => {
  try {
    const pyqs = await Pyq.find({
      class: 11,
      board: "rbse",
      medium: "english",
    });
    res.json(pyqs);
  } catch (error) {
    res.status;
  }
});

router.get("/rbse/english/12", async (req, res) => {
  try {
    const pyqs = await Pyq.find({
      class: 12,
      board: "rbse",
      medium: "english",
    });
    res.json(pyqs);
  } catch (error) {
    res.status;
  }
});

router.get("/rbse/hindi/11", async (req, res) => {
  try {
    const pyqs = await Pyq.find({
      class: 11,
      board: "rbse",
      medium: "hindi",
    });
    res.json(pyqs);
  } catch (error) {
    res.status;
  }
});

router.get("/rbse/hindi/12", async (req, res) => {
  try {
    const pyqs = await Pyq.find({
      class: 12,
      board: "rbse",
      medium: "hindi",
    });
    res.json(pyqs);
  } catch (error) {
    res.status;
  }
});

router.get("/cbse/11", async (req, res) => {
  try {
    const pyqs = await Pyq.find({
      class: 11,
      board: "cbse",
    });
    res.json(pyqs);
  } catch (error) {
    res.status;
  }
});

router.get("/cbse/12", async (req, res) => {
  try {
    const pyqs = await Pyq.find({
      class: 12,
      board: "cbse",
    });
    res.json(pyqs);
  } catch (error) {
    res.status;
  }
});

export default router;
