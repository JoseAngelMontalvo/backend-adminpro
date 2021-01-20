const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const rolesValidos = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} no es un role permitido",
};

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  surname: {
    type: String,
    required: [true, "Surname is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Pasword is required"],
  },
  img: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: true,
    default: "USER_ROLE",
    enum: rolesValidos,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

userSchema.plugin(uniqueValidator, { message: "El {PATH} ha de ser único" });
module.exports = mongoose.model("User", userSchema);
