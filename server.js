const express = require("express");
require("dotenv").config();
const path = require('path'); 
const cookieParser = require("cookie-parser");
const configureCors = require("./src/config/corsConfig.js");
const DBConnection = require("./src/config/mongoDB.js");
const routes = require("./src/routes/index.js");

const app = express();
const port = process.env.PORT || 8080;

// Apply CORS middleware
app.use(configureCors());

// Use cookie-parser to parse cookies
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));
app.use('/public', express.static(path.join(__dirname, 'public')));

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
