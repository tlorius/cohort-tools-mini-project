// ./models/Student.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  linkedinUrl: String,
  languages: [
    {
      type: String,
      enum: [
        "English",
        "Spanish",
        "French",
        "German",
        "Portuguese",
        "Dutch",
        "Other",
      ],
    },
  ],
  program: {
    type: String,
    enum: ["Web Dev", "UX/UI", "Data Analytics", "Cybersecurity"],
  },
  background: String,
  image: {
    type: String,
    default: "https://i.imgur.com/r8bo8u7.png",
  },
  cohort: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cohort", // Reference to the Cohort model
  },
  projects: [String], // Array of project names
});

module.exports = mongoose.model("Student", studentSchema);
