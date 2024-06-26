import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
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

const dpp = mongoose.model("dpp", noteSchema);

export default dpp;
