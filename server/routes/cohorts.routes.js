const Cohort = require("../models/Cohort.model");
const router = require("express").Router();

// Retrieves all of the cohorts in the database collection
router.get("/", async (req, res, next) => {
  try {
    const cohorts = await Cohort.find({});
    res.status(200).json(cohorts);
  } catch (err) {
    next(err);
  }
});
// POST Creates a new cohort
router.post("/", async (req, res, next) => {
  try {
    const createdCohort = await Cohort.create(req.body);
    res.status(201).json(createdCohort);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ err, message: "Duplicate somewhere" });
    } else {
      next(err);
    }
  }
});
// GET Retrieves a specific cohort by id
router.get("/:cohortId", async (req, res, next) => {
  const cohortId = req.params.cohortId;
  try {
    const cohort = await Cohort.findById(cohortId);
    res.status(200).json(cohort);
  } catch (err) {
    next(err);
  }
});
// PUT Updates a specific cohort by id
router.put("/:cohortId", async (req, res, next) => {
  const cohortId = req.params.cohortId;
  try {
    const updatedCohort = await Cohort.findByIdAndUpdate(cohortId, req.body, {
      new: true,
    });
    res.status(200).json(updatedCohort);
  } catch (err) {
    next(err);
  }
});
// DELETE Deletes a specific cohort by id
router.delete("/:cohortId", async (req, res, next) => {
  try {
    await Cohort.findByIdAndDelete(req.params.cohortId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
