const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
// Import CORS //
const cors = require("cors");
// Import Mongoose //
const mongoose = require("mongoose");
// Import Mongoose models //
const Student = require("./models/Student.model");
const Cohort = require("./models/Cohort.model");
// Import Error Handling //
const errorHandler = require("./middlewares/errorHandler");

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();
// Connect to the MongoDB database //
mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));

// MIDDLEWARE
// CORS //
app.use(
  cors({
    origin: ["http://localhost:5173", "http://example.com"], // Add the URLs of allowed origins to this array
  })
);
// Rest of MIDDLEWARE
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// Retrieves all of the cohorts in the database collection
app.get("/api/cohorts", async (req, res, next) => {
  try {
    const cohorts = await Cohort.find({});
    res.status(200).json(cohorts);
  } catch (error) {
    next(err);
  }
});
// POST Creates a new cohort
app.post("/api/cohorts", async (req, res, next) => {
  try {
    const createdCohort = await Cohort.create(req.body);
    res.status(201).json(createdCohort);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error, message: "Duplicate somewhere" });
    } else {
      next(error);
    }
  }
});
// GET Retrieves a specific cohort by id
app.get("/api/cohorts/:cohortId", async (req, res, next) => {
  const cohortId = req.params.cohortId;
  try {
    const cohort = await Cohort.findById(cohortId);
    res.status(200).json(cohort);
  } catch (error) {
    next(error);
  }
});
// PUT Updates a specific cohort by id
app.put("/api/cohorts/:cohortId", async (req, res, next) => {
  const cohortId = req.params.cohortId;
  try {
    const updatedCohort = await Cohort.findByIdAndUpdate(cohortId, req.body, {
      new: true,
    });
    res.status(200).json({ updatedCohort, message: `${updatedCohort} was updated from the db` });
  } catch (error) {
    next(error);
  }
});
// DELETE Deletes a specific cohort by id
app.delete("/api/cohorts/:cohortId", async (req, res, next) => {
  const { cohortId } = req.params;
  try {
    const cohortToDelete = await Cohort.findByIdAndDelete(cohortId);
    res.status(202).json({ message: `${cohortToDelete.cohortName} was removed from the db` });
  } catch (err) {
    next(err);
  }
});

// STUDENTS //

// GET Retrieves all of the students in the database collection
app.get("/api/students", async (req, res, next) => {
  
  try {
    const students = await Student.find({}).populate("cohort");
    res.status(200).json(students);
  } catch (error) {
    next(err);
  }
});
// POST Creates a new student
app.post("/api/students", async (req, res, next) => {
  try {
    const createdStudent = await Student.create(req.body);
    res.status(201).json(createdStudent);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error, message: "Duplicate somewhere" });
    } else {
      next(err);
    }
  }
});
// GET Retrieves all of the students for a given cohort
app.get("/api/students/cohort/:cohortId", async (req, res, next) => {
  const cohortId = req.params.cohortId;
  try {
    const students = await Student.find({ cohort: cohortId }).populate(
      "cohort"
    );
    res.status(200).json(students);
  } catch (error) {
    next(err);
  }
});
// GET Retrieves a specific student by id
app.get("/api/students/:studentId", async (req, res, next) => {
  const studentId = req.params.studentId;
  try {
    const student = await Student.findById(studentId).populate("cohort");
    res.status(200).json(student);
  } catch (error) {
    next(err);
  }
});
// PUT Updates a specific student by id
app.put("/api/students/:studentId", async (req, res, next) => {
  const studentId = req.params.studentId;
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedStudent);
  } catch (error) {
    next(err);
  }
});
// DELETE Deletes a specific student by id
app.delete("/api/students/:studentId", async (req, res, next) => {
  const { studentId } = req.params;
  try {
   const studentToDelete =  await Student.findByIdAndDelete(studentId);
    res.status(202).json({ message: `${studentToDelete.firstName} ${studentToDelete.lastName} was removed from the db` });
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
  console.log(`Server listening on port http://localhost:${PORT}`);
});
