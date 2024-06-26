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
  content: {
    type: String,
    required: true,
  },
  img_name: {
    type: String,
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

const Note = mongoose.model("Note", noteSchema);

export default Note;
