//Required
var express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const User = require("../models/user");
const Hospital = require("../models/hospital");
const Doctor = require("../models/doctor");

//Inicializar variables
var app = express();
// default options
app.use(fileUpload());

app.put("/:type/:id", (req, res, next) => {
  const type = req.params.type;
  const id = req.params.id;

  //validate type of collections
  const validateTypes = ["users", "doctors", "hospitals"];
  if (validateTypes.indexOf(type) < 0) {
    return res.status(400).json({
      ok: false,
      message: "Tipo de collection no valida",
      errors: {
        message: "Las collections válidas son " + validateTypes.join(", "),
      },
    });
  }

  //validams si viene archivo adjunto
  if (!req.files) {
    return res.status(500).json({
      ok: false,
      message: "No se subio el archivo",
      errors: { message: "Error al subir imagen" },
    });
  }

  //validamos algunas cosas del archivo
  const file = req.files.image;
  const nameSplit = file.name.split(".");
  const extension = nameSplit[nameSplit.length - 1];

  //extensiones permitidas
  const validateExtensions = ["png", "jpg", "gif", "jpeg"];

  if (validateExtensions.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      message: "Extension de archivo no valida",
      errors: {
        message: "Las extensiones válidas son " + validateExtensions.join(", "),
      },
    });
  }

  //crear nombre de imagen upload
  const nameFile = `${id}-${new Date().getMilliseconds()}.${extension}`;

  //move file temp to path folder server
  const pathFile = `./uploads/${type}/${nameFile}`;
  file.mv(pathFile, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Ha ocurrido un error al guardar el archivo",
        errors: err,
      });
    }

    uploadForType(type, id, nameFile, res);

    // res.status(200).json({
    //   ok: true,
    //   message: "Archivo subido correctamente",
    // });
  });
});

function uploadForType(type, id, nameFile, res) {
  if (type === "users") {
    User.findById(id, (err, user) => {
      if (!user) {
        return res.status(400).json({
          ok: false,
          message: "El usuario para actualizar su imagen no existe",
          errors: { message: "El usuario para actualizar su imagen no existe" },
        });
      }
      //si existe, eliminamos el archivo viejo
      const oldPath = "./uploads/users/" + user.img;
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
      user.img = nameFile;
      user.save((err, userRefresh) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            message: "Ocurrio un error al actualizar la imagen del usuario",
            errors: err,
          });
        }
        userRefresh.password = ":)";
        return res.status(200).json({
          ok: true,
          message: "Usuario actualizado correctamente",
          usuario: userRefresh,
        });
      });
    });
  }
  if (type === "doctors") {
    Doctor.findById(id, (err, doctor) => {
      if (!doctor) {
        return res.status(400).json({
          ok: false,
          message: "El doctor para actualizar su imagen no existe",
          errors: { message: "El doctor para actualizar su imagen no existe" },
        });
      }
      //si existe, eliminamos el archivo viejo
      const oldPath = "./uploads/doctors/" + doctor.img;
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
      doctor.img = nameFile;
      doctor.save((err, doctorRefresh) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            message: "Ocurrio un error al actualizar la imagen del doctor",
            errors: err,
          });
        }
        return res.status(200).json({
          ok: true,
          message: "Doctor actualizado correctamente",
          doctor: doctorRefresh,
        });
      });
    });
  }
  if (type === "hospitals") {
    Hospital.findById(id, (err, hospital) => {
      if (!hospital) {
        return res.status(400).json({
          ok: false,
          message: "El hospital para actualizar su imagen no existe",
          errors: {
            message: "El hospital para actualizar su imagen no existe",
          },
        });
      }
      //si existe, eliminamos el archivo viejo
      const oldPath = "./uploads/hospitals/" + hospital.img;
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
      hospital.img = nameFile;
      hospital.save((err, hospitalRefresh) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            message: "Ocurrio un error al actualizar la imagen del hospital",
            errors: err,
          });
        }
        return res.status(200).json({
          ok: true,
          message: "Hospital actualizado correctamente",
          hospital: hospitalRefresh,
        });
      });
    });
  }
}
module.exports = app;
