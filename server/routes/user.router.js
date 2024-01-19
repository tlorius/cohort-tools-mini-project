const User = require("../models/User.models");
const router = require("express").Router();

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash"); // Remove Password with .select
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
