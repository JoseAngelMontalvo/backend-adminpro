const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { SEED, CLIENT_ID } = require("../config/config");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(CLIENT_ID);

const app = express();
//Auth Google
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  //const userid = payload["sub"];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
  return {
    name: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true,
  };
}

app.post("/google", async (req, res) => {
  const token = req.body.token;
  const googleUser = await verify(token).catch((e) => {
    return res.status(500).json({
      ok: false,
      message: "Token no valid",
    });
  });
  User.findOne({ email: googleUser.email }, (err, UserDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error al buscar usuario",
        errors: err,
      });
    }
    if (userDB) {
      if (userDB.google === false) {
        return res.status(400).json({
          ok: false,
          message: "Debe utilizar su autenticacion",
        });
      } else {
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
      }
    } else {
      //El usuario no existe y hay que crearlo
      const user = new User();
      user.name = googleUser.name;
      user.email = googleUser.email;
      user.img = googleUser.img;
      user.google = true;
      user.password = ":)";
      user.save((err, userDB) => {
        //Crear un token
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
    }
  });
  // return res.status(200).json({
  //   ok: true,
  //   message: "OK!!!",
  //   googleUser: googleUser,
  // });
});
//Auth normal
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
