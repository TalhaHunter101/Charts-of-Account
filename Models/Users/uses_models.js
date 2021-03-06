const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const USERS = new mongoose.Schema({
  firstname: { type: "string", required: [true, "Please add a firstname"] },
  lastname: { type: "string", required: [true, "Please add a lastname"] },
  email: {
    type: String,
    required: [true, "Please add a email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add password"],
  },
  status: { type: String, enum: ["active", "inactive"], default: "inactive" },
  Role_and_permissions: {
    Role: {
      type: String,
      enum: ["admin", "subadmin", "supervisor", "user", "seller", "coustomer"],
      default: "user",
    },
  },
});

USERS.pre("save", function (next) {
  const user = this;

  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function (saltError, salt) {
      //by default salt
      if (saltError) {
        return next(saltError);
      } else {
        bcrypt.hash(user.password, salt, function (hashError, hash) {
          if (hashError) {
            return next(hashError);
          }
          user.password = hash;
          next();
        });
      }
    });
  } else {
    return next();
  }
});

const users = mongoose.model("users", USERS);
module.exports = users;
