import express from "express";
import dotenv from "dotenv";
import Note from "../models/notes.js";
dotenv.config();

const router = express.Router();

router.get("/rbse/hindi/11", async (req, res) => {
  try {
    const notes = await Note.find({
      class: 11,
      board: "rbse",
      medium: "hindi",
    });
    res.json(notes);
  } catch (error) {
    res.status;
  }
});

router.get("/rbse/english/11", async (req, res) => {
  try {
    const notes = await Note.find({
      class: 11,
      board: "rbse",
      medium: "english",
    });
    res.json(notes);
  } catch (error) {
    res.status;
  }
});

router.get("/rbse/hindi/12", async (req, res) => {
  try {
    const notes = await Note.find({
      class: 12,
      board: "rbse",
      medium: "hindi",
    });
    res.json(notes);
  } catch (error) {
    res.status;
  }
});

router.get("/rbse/english/12", async (req, res) => {
  try {
    const notes = await Note.find({
      class: 12,
      board: "rbse",
      medium: "english",
    });
    res.json(notes);
  } catch (error) {
    res.status;
  }
});

router.get("/cbse/11", async (req, res) => {
  try {
    const notes = await Note.find({
      class: 11,
      board: "cbse",
      medium: "english",
    });
    res.json(notes);
  } catch (error) {
    res.status;
  }
});

router.get("/cbse/12", async (req, res) => {
  try {
    const notes = await Note.find({
      class: 12,
      board: "cbse",
      medium: "english",
    });
    res.json(notes);
  } catch (error) {
    res.status;
  }
});

export default router;
