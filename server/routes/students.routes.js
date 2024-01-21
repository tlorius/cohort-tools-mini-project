const Student = require("../models/Student.model");
const router = require("express").Router();

// GET Retrieves all of the students in the database collection
router.get("/", async (req, res, next) => {
  try {
    const students = await Student.find().populate("cohort");
    res.status(200).json(students);
  } catch (err) {
    next(err);
  }
});
// POST Creates a new student
router.post("/", async (req, res, next) => {
  try {
    const createdStudent = await Student.create(req.body);
    res.status(201).json(createdStudent);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ err, message: "Duplicate somewhere" });
    } else {
      next(err);
    }
  }
});
// GET Retrieves all of the students for a given cohort
router.get("/cohort/:cohortId", async (req, res, next) => {
  const cohortId = req.params.cohortId;
  try {
    const students = await Student.find({ cohort: cohortId }).populate(
      "cohort"
    );
    res.status(200).json(students);
  } catch (err) {
    next(err);
  }
});
// GET Retrieves a specific student by id
router.get("/:studentId", async (req, res, next) => {
  const studentId = req.params.studentId;
  try {
    const student = await Student.findById(studentId).populate("cohort");
    res.status(200).json(student);
  } catch (err) {
    next(err);
  }
});
// PUT Updates a specific student by id
router.put("/:studentId", async (req, res, next) => {
  const studentId = req.params.studentId;
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedStudent);
  } catch (err) {
    next(err);
  }
});
// DELETE Deletes a specific student by id
router.delete("/:studentId", async (req, res, next) => {
  try {
    await Student.findByIdAndDelete(req.params.studentId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
