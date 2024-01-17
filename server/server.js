const express = require("express");
const morgan = require("morgan");
<<<<<<< feat/day2researchcors
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const PORT = 5005;

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
const Student = require("./models/Student.model");
const Cohort = require("./models/Cohort.model");
=======
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cohorts = require("./data/cohorts.json")
const students = require("./data/students.json")

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...

>>>>>>> master

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

<<<<<<< feat/day2researchcors
mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
app.use(
  cors({
    origin: ["http://localhost:5173", "http://example.com"], // Add the URLs of allowed origins to this array
  })
);

=======

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
>>>>>>> master
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

<<<<<<< feat/day2researchcors
=======

>>>>>>> master
// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
<<<<<<< feat/day2researchcors
});

app.get("/api/cohorts", async (req, res) => {
  try {
    const cohorts = await Cohort.find({});
    res.status(200).json(cohorts);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve cohorts" });
  }
});

app.post("/api/cohorts", async (req, res) => {
  try {
    const createdCohort = await Cohort.create(req.body);
    res.status(201).json(createdCohort);
  } catch (error) {
    res.status(500).json({ error: "Failed to create the cohort" });
  }
});

app.get("/api/cohorts/:cohortId", async (req, res) => {
  const cohortId = req.params.cohortId;
  try {
    const cohort = await Cohort.findById(cohortId);
    res.status(200).json(cohort);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve cohort" });
  }
});

app.put("/api/cohorts/:cohortId", async (req, res) => {
  const cohortId = req.params.cohortId;
  try {
    const updatedCohort = await Cohort.findByIdAndUpdate(cohortId, req.body, {
      new: true,
    });
    res.status(200).json(updatedCohort);
  } catch (error) {
    res.status(500).json({ error: "Failed to update cohort" });
  }
});

app.delete("/api/cohorts/:cohortId", async (req, res) => {
  try {
    await Cohort.findByIdAndDelete(req.params.cohortId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete cohort" });
  }
});

app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find({});
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve students" });
  }
});

app.post("/api/students", async (req, res) => {
  try {
    const createdStudent = await Student.create(req.body);
    res.status(201).json(createdStudent);
  } catch (error) {
    res.status(500).json({ error: "Failed to create the student" });
  }
});

app.get("/api/students/cohort/:cohortId", async (req, res) => {
  const cohortId = req.params.cohortId;
  try {
    const students = await Student.find({ cohort: cohortId });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve students" });
  }
});

app.get("/api/students/:studentId", async (req, res) => {
  const studentId = req.params.studentId;
  try {
    const student = await Student.findById(studentId);
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve student" });
  }
});

app.put("/api/students/:studentId", async (req, res) => {
  const studentId = req.params.studentId;
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: "Failed to update student" });
  }
});

app.delete("/api/students/:studentId", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.studentId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete student" });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
=======

})
app.get('/api/cohorts', (_, response) => {
  response.json(cohorts)
})

app.get('/api/students', (_, response) => {
  response.json(students)
})

;
// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
>>>>>>> master
