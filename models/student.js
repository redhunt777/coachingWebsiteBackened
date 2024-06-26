import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  medium: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  class: {
    type: Number,
    required: true,
  },
  board: {
    type: String,
    required: true,
  },
});

const Student = mongoose.model("student", studentSchema);

export default Student;
