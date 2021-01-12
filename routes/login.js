const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { SEED } = require("../config/config");

const app = express();
app.post("/", (req, res) => {
  const body = req.body;
  User.findOne({ email: body.email }, (err, userDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error al buscar usuario",
        errors: err,
      });
    }
    if (!userDB) {
      return res.status(400).json({
        ok: false,
        message: "Credenciales incorrectas - email",
        errors: {
          message: "El usuario con el mail " + body.email + " no existe",
        },
      });
    }
    if (!bcrypt.compareSync(body.password, userDB.password)) {
      return res.status(400).json({
        ok: false,
        message: "Credenciales incorrectas - password",
        errors: {
          message: "Las password no coinciden",
        },
      });
    }

    //Crear un token
    userDB.password = ":)";
    const token = jwt.sign(
      { user: userDB },
      SEED, //secret
      { expiresIn: 14400 } //4horas
    );

    res.status(200).json({
      ok: true,
      user: userDB,
      token: token,
      id: userDB.id,
    });
  });
});
module.exports = app;
