import express from "express";
import Dpp from "../models/dpp.js";

const router = express.Router();

router.get("/rbse/english/11", async (req, res) => {
  try {
    const dpp = await Dpp.find({ class: 11, medium: "english", board: "rbse" });
    res.json(dpp);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/rbse/english/12", async (req, res) => {
  try {
    const dpp = await Dpp.find({ class: 12, medium: "english", board: "rbse" });
    res.json(dpp);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/rbse/hindi/11", async (req, res) => {
  try {
    const dpp = await Dpp.find({ class: 11, medium: "hindi", board: "rbse" });
    res.json(dpp);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/rbse/hindi/12", async (req, res) => {
  try {
    const dpp = await Dpp.find({ class: 12, medium: "hindi", board: "rbse" });
    res.json(dpp);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/cbse/11", async (req, res) => {
  try {
    const dpp = await Dpp.find({ class: 11, board: "cbse" });
    res.json(dpp);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/cbse/12", async (req, res) => {
  try {
    const dpp = await Dpp.find({ class: 12, board: "cbse" });
    res.json(dpp);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
