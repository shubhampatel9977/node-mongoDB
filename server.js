const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const configureCors = require("./src/config/corsConfig.js");
const configureRateLimiter = require("./src/config/rateLimiterConfig.js");
const DBConnection = require("./src/config/mongoDB.js");
const routes = require("./src/routes/index.js");

const app = express();
const port = process.env.PORT || 8080;

// Apply CORS middleware
app.use(configureCors());

// Apply rate limiter middleware
// app.use(configureRateLimiter());

// Use cookie-parser to parse cookies
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Database Connection
DBConnection();

// default route
app.get("/", (req, res) => {
  res.status(200).json("Api working fine!");
});

app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
