//Required
const express = require("express");
const Hospital = require("../models/hospital");
const Doctor = require("../models/doctor");
const User = require("../models/user");

//Inicializar variables
const app = express();

//search one collection
app.get("/collection/:table/:search", (req, res, next) => {
  const search = req.params.search;
  const regex = new RegExp(search, "i");
  const table = req.params.table;

  switch (table) {
    case "users":
      promesa = searchUsers(search, regex);
      break;

    case "hospitals":
      promesa = searchHospitals(search, regex);
      break;

    case "doctors":
      promesa = searchDoctors(search, regex);
      break;

    default:
      return res.status(400).json({
        ok: false,
        message:
          "Los tipos de busqueda solo son Usuarios, Doctores y Hospitales",
        error: { message: "Tipo de tabla erronea" },
      });
  }
  promesa.then((data) => {
    res.status(200).json({
      ok: true,
      [table]: data,
    });
  });
});

//search all collections
app.get("/all/:search", (req, res, next) => {
  const search = req.params.search;
  const regex = new RegExp(search, "i");
  Promise.all([
    searchHospitals(search, regex),
    searchDoctors(search, regex),
    searchUsers(search, regex),
  ]).then((response) => {
    res.status(200).json({
      ok: true,
      hospitals: response[0],
      doctors: response[1],
      users: response[2],
    });
  });
});

function searchHospitals(search, regex) {
  return new Promise((resolve, reject) => {
    Hospital.find({ name: regex })
      .populate("user", "name email")
      .exec((err, hospitals) => {
        if (err) {
          reject("Error al buscar hospitales", err);
        } else {
          resolve(hospitals);
        }
      });
  });
}

function searchDoctors(search, regex) {
  return new Promise((resolve, reject) => {
    Doctor.find({ name: regex })
      .populate("user", "name email")
      .populate("hospital")
      .exec((err, doctors) => {
        if (err) {
          reject("Error al buscar doctores", err);
        } else {
          resolve(doctors);
        }
      });
  });
}

function searchUsers(search, regex) {
  return new Promise((resolve, reject) => {
    User.find({}, "name email role")
      .or([{ name: regex }, { email: regex }])
      .exec((err, users) => {
        if (err) {
          reject("Error al buscar usuarios", err);
        } else {
          resolve(users);
        }
      });
  });
}
module.exports = app;
