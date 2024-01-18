const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
// Import CORS //
const cors = require("cors");
// Import Mongoose //
const mongoose = require("mongoose");
// Import Mongoose models //
const Cohort = require("./models/Cohort");
const Student = require("./models/Student");
// Import Error Handling //
const errorHandler = require("./middlewares/errorHandler");

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
/*
const cohortsData = require("./cohorts.json");
const studentsData = require("./students.json");*/

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// CORS //
app.use(cors({ origin: ["http://localhost:5173", "http://example.com"] }));
// Rest of MIDDLEWARE
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Connect to the MongoDB database //
mongoose
  .connect("mongodb://localhost:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`)) // If connected
  .catch((error) => {
    console.error("Error connecting to MongoDB", error); // if error
  });

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// COHORTS //
app.get("/api/cohorts", async (req, res, next) => {
  try {
    const cohorts = await Cohort.find();
    res.json(cohorts);
  } catch (err) {
    next(err);
  }
});

// GET a specific cohort by id //
app.get("/api/cohorts/:cohortId", async (req, res, next) => {
  try {
    const cohort = await Cohort.findById(req.params.cohortId);
    res.json(cohort);
  } catch (err) {
    next(err);
  }
});
// POST a new cohort //
app.post("/api/cohorts", async (req, res, next) => {
  try {
    const newCohort = new Cohort(req.body);
    await newCohort.save();
    res.status(201).json(newCohort);
  } catch (err) {
    next(err);
  }
});
// PUT route to update a specific cohort by id
app.put("/api/cohorts/:cohortId", async (req, res, next) => {
  try {
    const updatedCohort = await Cohort.findByIdAndUpdate(
      req.params.cohortId,
      req.body,
      { new: true }
    );
    res.json(updatedCohort);
  } catch (err) {
    next(err);
  }
});

// DELETE route to delete a specific cohort by id
app.delete("/api/cohorts/:cohortId", async (req, res, next) => {
  try {
    await Cohort.findByIdAndDelete(req.params.cohortId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// STUDENTS //

// GET /api/students - Returns all students
app.get("/api/students", async (req, res, next) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    next(err);
  }
});

// POST /api/students - Creates a new student
app.post("/api/students", async (req, res, next) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    next(err);
  }
});

// GET /api/students/cohort/:cohortId - Returns all students of a specified cohort
app.get("/api/students/cohort/:cohortId", async (req, res, next) => {
  try {
    const cohortStudents = await Student.find({
      cohort: req.params.cohortId,
    }).populate("cohort");
    res.json(cohortStudents);
  } catch (err) {
    next(err);
  }
});

// GET /api/students/:studentId - Returns the specified student by id
app.get("/api/students/:studentId", async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.studentId).populate(
      "cohort"
    );
    if (!student) {
      return res.status(404).send("Student not found");
    }
    res.json(student);
  } catch (err) {
    next(err);
  }
});

// PUT /api/students/:studentId - Updates the specified student by id
app.put("/api/students/:studentId", async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.studentId,
      req.body,
      { new: true }
    );
    res.json(student);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/students/:studentId - Deletes the specified student by id
app.delete("/api/students/:studentId", async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.studentId);
    if (!student) {
      return res.status(404).send("Student not found");
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Use the error handling middleware
app.use(errorHandler);
// Handle 404 errors
app.use((req, res, next) => {
  const error = new Error("Nope not on this page buddy");
  error.statusCode = 404;
  next(error);
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
