const express = require("express");

//access environment variables
require("dotenv").config();

//require the database connection
require("./mongodb");
const app = express();


app.listen(3000, () => console.log("Server is running on port 3000"));


//enable the use of json in the body of the request
app.use(express.json());


//allow access to the frontend
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//require the routes
const indexRoutes = require("./routes/index.routes");
const authRoutes = require("./routes/auth.routes");
const sauceRoutes = require("./routes/sauce.routes");

//define the routes
app.use("/", indexRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", sauceRoutes);

//define the image folder
const path = require("path");
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
