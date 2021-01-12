//Required
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

var app = express();

//body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Inicializar variables

var appRoutes = require("./routes/app");
var userRoutes = require("./routes/user");
var loginRoutes = require("./routes/login");

//Conexion a la BBDD
mongoose.connection.openUri(
  "mongodb://localhost:27017/hospitalDB",
  (err, resp) => {
    if (err) throw err;
    console.log("Base de Datos: \x1b[32m%s\x1b[0m", "Online");
  }
);

//rutas
app.use("/login", loginRoutes);
app.use("/user", userRoutes);
app.use("/", appRoutes);

//escuchar peticiaones
app.listen(3000, () => {
  console.log(
    "Express server listennig on port 3000: \x1b[32m%s\x1b[0m",
    "Online"
  );
});
