const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const PORT = 5005;
// Import CORS //
const cors = require("cors");
// Import Mongoose //
const mongoose = require("mongoose");

// Import Error Handling //
const errorHandler = require("./middlewares/errorHandler");
// import Authenticator Middleware
const { isAuthenticated } = require("./middlewares/route-guard.middleware");
require("dotenv").config();
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
app.use(helmet());
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

//ROUTER FOR COHORTS
const cohortsRouter = require("./routes/cohorts.routes");
app.use("/api/cohorts", cohortsRouter);

//ROUTER FOR STUDENTS
const studentsRouter = require("./routes/students.routes");
app.use("/api/students", studentsRouter);

// ROUTER FOR USERS
const userRouter = require("./routes/user.routes");
app.use("/api/users", isAuthenticated, userRouter);

// ROUTER FOR AUTHENTICATION
const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter);

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
