import mongoose from "mongoose";

const ncertSchema = new mongoose.Schema({
  class: {
    type: Number,
    required: true,
  },
  chapter: {
    type: Number,
    required: true,
  },
  title: {
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
});

const Ncert = mongoose.model("Ncert", ncertSchema);

export default Ncert;
