const express = require("express");
const Hospital = require("../models/hospital");
const mdAuthToken = require("../middleware/auth");

const app = express();

//get all hospitals
app.get("/", (req, res) => {
  const page = Number(req.query.page || 0);
  Hospital.find({})
    .skip(page)
    .limit(5)
    .populate("user", "name email")
    .exec((err, hospitals) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Ha ocurrido un error al recuperar los hospitales",
          errors: err,
        });
      }
      Hospital.count((err, total) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            message: "Error al contar los hospitales",
            errors: err,
          });
        }

        res.status(200).json({
          ok: true,
          hospitals: hospitals,
          total: total,
        });
      });
    });
});

//Save hospital
app.post("/", mdAuthToken.verifyToken, (req, res) => {
  const body = req.body;
  const hospital = new Hospital({
    name: body.name,
    user: req.userToken._id,
  });

  hospital.save((err, hospitalSave) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        message: "Error al guardar hospital",
        errors: err,
      });
    }

    res.status(201).json({
      ok: true,
      hospital: hospitalSave,
    });
  });
});

//Refresh hospital
app.put("/:id", mdAuthToken.verifyToken, (req, res) => {
  const id = req.params.id;
  const body = req.body;
  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error al buscar el hospital",
        errors: err,
      });
    }
    if (!hospital) {
      return res.status(400).json({
        ok: false,
        message: "El usuario con el id " + id + " no existe",
        errors: { message: "No existe el hospital con este id" },
      });
    }
    hospital.name = body.name;
    hospital.user = req.userToken._id;

    hospital.save((err, hospitalSave) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Error al actualizar hospital",
          errors: err,
        });
      }
      res.status(200).json({
        ok: true,
        hospital: hospitalSave,
        // userToken: req.userToken,
      });
    });
  });
});

//delete hospital
app.delete("/:id", mdAuthToken.verifyToken, (req, res) => {
  const id = req.params.id;
  Hospital.findByIdAndRemove(id, (err, hospitalDelete) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "ha ocurrido un error al eliminar el hospital",
        erros: err,
      });
    }
    if (!hospitalDelete) {
      return res.status(400).json({
        ok: false,
        message: "El hospital con el id " + id + " no existe",
      });
    }
    res.status(200).json({
      ok: true,
      hospital: hospitalDelete,
      userToken: req.userToken,
    });
  });
});

module.exports = app;
