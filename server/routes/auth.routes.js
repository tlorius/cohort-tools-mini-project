const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const router = express.Router();
const { isAuthenticated } = require("../middlewares/jwt.middleware");
const saltRounds = 10;

//POST /auth/signup
router.post("/signup", (req, res, next) => {
  const { email, password, name } = req.body;

  //checking if name, password or email was provided as an empty string
  if (email === "" || password === "" || name === "") {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }

  //use regex to validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  //use regex to validate the password format
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  //check the users collection if a user with the same email already exists
  User.findOne({ email })
    .then((foundUser) => {
      //if user with same email already exists throw an error
      if (foundUser) {
        restart.status(400).json({ message: "User already exists." });
        return;
      }

      //if email is unique, proceed to hash the password

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      //create new user in the database
      //we return a pending promise, which allows us to chain another then
      return User.create({ email, password: hashedPassword, name });
    })
    .then((createdUser) => {
      //deconstructing newly created user to omit the password to not expose it
      const { email, name, _id } = createdUser;

      //create new object that doesnt export the password
      const user = { email, name, _id };

      //send a json response containing the user object
      res.status(201).json({ user: user });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

//POST /auth/login
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  //check if email or password are provided as empty string
  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  //check the users collection if a user with the same email exists
  User.findOne({ email })
    .then((foundUser) => {
      //if the user was not found, send an error response
      if (!foundUser) {
        res.status(401).json({ message: "User not found." });
        return;
      }

      //compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        //deconstruct to omit the password
        const { _id, email, name } = foundUser;
        //create object that will set as the token payload
        const payload = { _id, email, name };

        //create and sign the token
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });
        //send the token as the response
        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: "Unable to authenticate the user" });
      }
    })
    .catch((error) =>
      res.status(500).json({ message: "Internal Server Error" })
    );
});

//GET /auth/verify
router.get("/verify", isAuthenticated, (req, res, next) => {
  //if jwt token is valid the payload gets decoded by the isauthenticated middleware
  console.log("req.payload", req.payload);
  //send back object with userdata previously set as the token payload
  res.status(200).json(req.payload);
});

module.exports = router;
