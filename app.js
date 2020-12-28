//Required
var express = require("express");
var mongoose = require("mongoose");

//Inicializar variables
var app = express();

//Conexion a la BBDD
mongoose.connection.openUri(
  "mongodb://localhost:27017/hospitalDB",
  (err, resp) => {
    if (err) throw err;
    console.log("Base de Datos: \x1b[32m%s\x1b[0m", "Online");
  }
);

//rutas
app.get("/", (req, res, next) => {
  res.status(200).json({
    ok: true,
    mensaje: "Petición realizada correctamente",
  });
});
//escuchar peticiaones
app.listen(3000, () => {
  console.log(
    "Express server listennig on port 3000: \x1b[32m%s\x1b[0m",
    "Online"
  );
});
