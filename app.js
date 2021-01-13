//Required
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

//body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Init const routes
const appRoutes = require("./routes/app");
const userRoutes = require("./routes/user");
const loginRoutes = require("./routes/login");
const doctorRoutes = require("./routes/doctor");
const hospitalRoutes = require("./routes/hospital");
const searchRoutes = require("./routes/search");
const uploadRoutes = require("./routes/upload");
const imagesRoutes = require("./routes/images");

//Connexion to DDBB
mongoose.connection.openUri(
  "mongodb://localhost:27017/hospitalDB",
  (err, resp) => {
    if (err) throw err;
    console.log("Base de Datos: \x1b[32m%s\x1b[0m", "Online");
  }
);

//Routes
app.use("/login", loginRoutes);
app.use("/user", userRoutes);
app.use("/hospital", hospitalRoutes);
app.use("/doctor", doctorRoutes);
app.use("/search", searchRoutes);
app.use("/upload", uploadRoutes);
app.use("/images", imagesRoutes);
app.use("/", appRoutes);

//listen petitions
app.listen(3000, () => {
  console.log(
    "Express server listennig on port 3000: \x1b[32m%s\x1b[0m",
    "Online"
  );
});
