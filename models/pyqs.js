import mongoose from "mongoose";

const pyqSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  chapter: {
    type: Number,
    required: true,
  },
  class: {
    type: Number,
    required: true,
  },
  medium: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  board: {
    type: String,
    required: true,
  },
});

const Pyq = mongoose.model("Pyq", pyqSchema);

export default Pyq;
