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

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
const cohortsData = require("./cohorts.json");
const studentsData = require("./students.json");

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
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
app.get("/api/cohorts", async (req, res) => {
  try {
    const cohorts = await Cohort.find();
    res.json(cohorts);
  } catch (err) {
    res.status(500).send("Error fetching cohorts");
  }
});

// GET a specific cohort by id //
app.get("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const cohort = await Cohort.findById(req.params.cohortId);
    if (!cohort) {
      return res.status(404).send("Cohort not found");
    }
    res.json(cohort);
  } catch (err) {
    res.status(500).send("Error fetching cohort");
  }
});
// POST a new cohort //
app.post("/api/cohorts", async (req, res) => {
  try {
    const newCohort = new Cohort(req.body);
    await newCohort.save();
    res.status(201).json(newCohort);
  } catch (err) {
    res.status(500).send("Error creating cohort");
  }
});
// PUT route to update a specific cohort by id
app.put("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const updatedCohort = await Cohort.findByIdAndUpdate(
      req.params.cohortId,
      req.body,
      { new: true }
    );
    if (!updatedCohort) {
      return res.status(404).send("Cohort not found");
    }
    res.json(updatedCohort);
  } catch (err) {
    res.status(500).send("Error updating cohort");
  }
});

// DELETE route to delete a specific cohort by id
app.delete("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const deletedCohort = await Cohort.findByIdAndDelete(req.params.cohortId);
    if (!deletedCohort) {
      return res.status(404).send("Cohort not found");
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).send("Error deleting cohort");
  }
});

// STUDENTS //

// GET /api/students - Returns all students
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).send("Error fetching students");
  }
});

// POST /api/students - Creates a new student
app.post("/api/students", async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).send("Error creating student");
  }
});

// GET /api/students/cohort/:cohortId - Returns all students of a specified cohort
app.get("/api/students/cohort/:cohortId", async (req, res) => {
  try {
    const cohortStudents = await Student.find({
      cohort: req.params.cohortId,
    });
    res.json(cohortStudents);
  } catch (err) {
    res.status(500).send("Error fetching students by cohort");
  }
});

// GET /api/students/:studentId - Returns the specified student by id
app.get("/api/students/:studentId", async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).send("Student not found");
    }
    res.json(student);
  } catch (err) {
    res.status(500).send("Error fetching student");
  }
});

// PUT /api/students/:studentId - Updates the specified student by id
app.put("/api/students/:studentId", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.studentId,
      req.body,
      { new: true }
    );
    if (!student) {
      return res.status(404).send("Student not found");
    }
    res.json(student);
  } catch (err) {
    res.status(500).send("Error updating student");
  }
});

// DELETE /api/students/:studentId - Deletes the specified student by id
app.delete("/api/students/:studentId", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.studentId);
    if (!student) {
      return res.status(404).send("Student not found");
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).send("Error deleting student");
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
