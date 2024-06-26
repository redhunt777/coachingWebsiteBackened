import express, { urlencoded } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import studentRouter from "./routes/student.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import crypto from "crypto";
import path from "path";
import { GridFSBucket } from "mongodb";
import ncertRouter from "./routes/ncert.js";
import Ncert from "./models/ncert.js";
import notesRouter from "./routes/notes.js";
import Notes from "./models/notes.js";
import pyqsRouter from "./routes/pyqs.js";
import Pyq from "./models/pyqs.js";
import Syllabus from "./models/syllabus.js";
import Dpp from "./models/dpp.js";
import dppRouter from "./routes/dpp.js";
import morgan from "morgan";

dotenv.config();

const app = express();
const mongoURI = process.env.DB_URL;

// app.use(
//   cors({
//     origin: [process.env.CORS_URL],
//     credentials: true,
//   })
// );
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(urlencoded({ extended: true }));
app.use("/ncert", ncertRouter);
app.use("/auth", studentRouter);
app.use("/notes", notesRouter);
app.use("/pyqs", pyqsRouter);
app.use("/dpp", dppRouter);

async function main() {
  mongoose.connect(mongoURI);
  console.log("Connected to MongoDB");
}

const db1 = mongoose.createConnection(process.env.DB_STOREFILES);

// Initialize GridFS after connecting to MongoDB
const conn = mongoose.connection;

let gfs, gridfsBucket;
db1.once("open", () => {
  gridfsBucket = new GridFSBucket(db1.db, {
    bucketName: "allPdfFiles",
  });

  gfs = {
    findOne: (filter) => db1.db.collection("allPdfFiles.files").findOne(filter),
    createReadStream: (filename) =>
      gridfsBucket.openDownloadStreamByName(filename),
  };
  console.log("Initialized GridFS for database1");
});
let filename;

const storage = new GridFsStorage({
  url: process.env.DB_STOREFILES,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        filename = buf.toString("hex") + path.extname(file.originalname);

        const fileInfo = {
          filename: filename,
          bucketName: "allPdfFiles",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });

app.post("/upload/ncert", upload.single("file"), (req, res) => {
  const ncert = new Ncert({
    class: req.body.class,
    chapter: req.body.chapter,
    fileName: filename,
    title: req.body.title,
    medium: req.body.medium,
  });
  ncert.save();
  res.json({ status: true, message: "File uploaded successfully" });
});

app.post("/upload/dpp", upload.single("file"), (req, res) => {
  const dpp = new Dpp({
    class: req.body.class,
    chapter: req.body.chapter,
    fileName: filename,
    title: req.body.title,
    medium: req.body.medium,
    board: req.body.board,
  });
  dpp.save();
  res.json({ status: true, message: "File uploaded successfully" });
});

app.post("/upload/notes", upload.single("file"), (req, res) => {
  const note = new Notes({
    class: req.body.class,
    chapter: req.body.chapter,
    fileName: filename,
    title: req.body.title,
    medium: req.body.medium,
    board: req.body.board,
    content: req.body.content,
    img_name: req.body.img_name,
  });
  note.save();
  res.json({ status: true, message: "File uploaded successfully" });
});

app.post("/upload/syllabus", upload.single("file"), (req, res) => {
  const syllabus = new Syllabus({
    class: req.body.class,
    medium: req.body.medium,
    board: req.body.board,
    fileName: filename,
  });
  syllabus.save();
  res.json({ status: true, message: "File uploaded successfully" });
});

app.post("/syllabus", (req, res) => {
  try {
    Syllabus.find({
      class: req.body.class,
      medium: req.body.medium,
      board: req.body.board,
    }).then((syllabus) => {
      res.json(syllabus);
    });
  } catch (error) {
    res.status;
  }
});

app.post("/upload/pyqs", upload.single("file"), (req, res) => {
  const pyq = new Pyq({
    class: req.body.class,
    chapter: req.body.chapter,
    fileName: filename,
    title: req.body.title,
    medium: req.body.medium,
    board: req.body.board,
  });
  pyq.save();
  res.json({ status: true, message: "File uploaded successfully" });
});

app.get("/files/:filename", async (req, res) => {
  try {
    const file = await gfs.findOne({ filename: req.params.filename });
    if (!file) {
      return res.status(404).json({ err: "No file exists" });
    }

    if (file.contentType === "application/pdf") {
      const readstream = gfs.createReadStream(file.filename);
      res.setHeader("Content-Type", "application/pdf");
      readstream.pipe(res);
    } else {
      res.status(404).json({ err: "Not a PDF" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Internal Server Error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

main().catch((err) => console.log(err));
