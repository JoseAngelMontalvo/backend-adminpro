const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const mdAuthToken = require("../middleware/auth");

const app = express();

//Get all users
app.get("/", (req, res, next) => {
  User.find({}, "name surname email img role").exec((err, users) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error al cargar usuarios",
        errors: err,
      });
    }
    res.status(200).json({
      ok: true,
      users: users,
    });
  });
});

//Save user
app.post("/", mdAuthToken.verifyToken, (req, res) => {
  const body = req.body;
  const user = new User({
    name: body.name,
    surname: body.surname,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role,
  });

  user.save((err, saveUser) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        message: "Error al guardar usuario",
        errors: err,
      });
    }
    saveUser.password = ":)";
    res.status(201).json({
      ok: true,
      user: saveUser,
      userToken: req.userToken,
    });
  });
});

//Refresh user
app.put("/:id", mdAuthToken.verifyToken, (req, res) => {
  var id = req.params.id;
  const body = req.body;

  User.findById(id, (err, user) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error al buscar user",
        errors: err,
      });
    }
    if (!user) {
      return res.status(400).json({
        ok: false,
        message: "El usuario con el id " + id + " no existe",
        errors: { message: "No existe un usuario con este id" },
      });
    }
    user.name = body.name;
    user.surname = body.surname;
    user.role = body.role;
    user.save((err, saveUser) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: "Error al guardar usuario",
          errors: err,
        });
      }
      saveUser.password = ":)";
      res.status(200).json({
        ok: true,
        user: saveUser,
        userToken: req.userToken,
      });
    });
  });
});

//Delete user
app.delete("/:id", mdAuthToken.verifyToken, (req, res) => {
  const id = req.params.id;
  User.findByIdAndRemove(id, (err, userDelete) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error al borrar usuario",
        errors: err,
      });
    }
    if (!userDelete) {
      return res.status(400).json({
        ok: false,
        message: "El usuario a borrar con ese id no existe",
        errors: { message: "No existe un usuario con ese id" },
      });
    }
    res.status(200).json({
      ok: true,
      user: saveUser,
      userToken: req.userToken,
    });
  });
});
module.exports = app;
