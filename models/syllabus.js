import mongoose from "mongoose";

const ncertSchema = new mongoose.Schema({
  class: {
    type: Number,
    required: true,
  },
  medium: {
    type: String,
    required: true,
  },
  board: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
});

const Syllabus = mongoose.model("syllabus", ncertSchema);

export default Syllabus;
