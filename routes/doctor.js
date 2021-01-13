const express = require("express");
const Doctor = require("../models/doctor");
const mdAuthToken = require("../middleware/auth");

const app = express();

//Get all doctors
app.get("/", (req, res) => {
  const page = Number(req.query.page || 0);
  Doctor.find({})
    .skip(page)
    .limit(5)
    .populate("user", "name email")
    .populate("hospital")
    .exec((err, doctors) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Ha ocurrido un error al obtener los doctores",
          errors: err,
        });
      }
      Doctor.count((err, total) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            message: "Ha ocurrido un error al contar los doctores",
            errors: err,
          });
        }
        res.status(200).json({
          ok: true,
          doctors: doctors,
          total: total,
        });
      });
    });
});

//Save doctor
app.post("/", mdAuthToken.verifyToken, (req, res) => {
  const body = req.body;
  const doctor = new Doctor({
    name: body.name,
    user: req.userToken._id,
    hospital: body.hospital._id,
  });
  doctor.save((err, doctorSave) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Ha ocurrido un error al guardar el doctor",
        errors: err,
      });
    }
    res.status(201).json({
      ok: true,
      doctor: doctorSave,
      user: req.userToken,
    });
  });
});

//Refresh doctor
app.put("/:id", mdAuthToken.verifyToken, (req, res) => {
  const id = req.params.id;
  const body = req.body;
  Doctor.findById(id, (err, doctorDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Ha ocurrido un error al actualziar el doctor",
        errors: err,
      });
    }
    if (!doctorDB) {
      return res.status(400).json({
        ok: false,
        message: "El doctor con el id " + id + " no existe",
        errors: err,
      });
    }

    doctorDB.name = body.name;
    doctorDB.user = req.userToken._id;
    doctorDB.hospital = body.hospital._id;

    doctorDB.save((err, doctorSave) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Ha ocurrido un error al actualziar el doctor",
          errors: err,
        });
      }
      res.status(200).json({
        ok: true,
        doctor: doctorSave,
      });
    });
  });
});

//Delete doctor
app.delete("/:id", (req, res) => {
  const id = req.params.id;
  Doctor.findByIdAndRemove(id, (err, doctorRemove) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "ha ocurrido un error al eliminar el doctor",
        erros: err,
      });
    }
    if (!doctorRemove) {
      return res.status(400).json({
        ok: false,
        message: "El doctor con el id " + id + " no existe",
      });
    }
    res.status(200).json({
      ok: true,
      doctor: doctorRemove,
    });
  });
});

module.exports = app;
