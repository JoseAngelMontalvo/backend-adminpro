var express = require("express");
const jwt = require("jsonwebtoken");
const { SEED } = require("../config/config");

var app = express();

//verify token
exports.verifyToken = function (req, res, next) {
  const token = req.query.token;
  jwt.verify(token, SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        message: "Invalid token",
        errors: err,
      });
    }
    req.userToken = decoded.user;
    next();
    // res.status(401).json({
    //   ok: false,
    //   decoded: decoded,
    // });
  });
};
