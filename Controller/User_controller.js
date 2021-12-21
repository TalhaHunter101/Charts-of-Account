const Users = require("../Models/Users/uses_models");
const Evalid = require("../email_validator");
var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
var express = require("express");
const bcrypt = require("bcrypt");
var app = express();
dotenv.config();
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
/////////////////////////// Users crud

exports.adduser = async (req, res, next) => {
  // console.log(req.user);

  if (req.body.firstname == "" || req.body.firstname == undefined) {
    res.status(400).json({ Message: "First name missing :: Enter again" });
    return;
  } else if (req.body.lastname == "" || req.body.lastname == undefined) {
    res.status(400).json({ Message: "Last name missing :: Enter again" });
    return;
  } else if (req.body.email == "" || req.body.email == undefined) {
    res.status(400).json({ Message: "Email missing :: Enter again" });
    return;
  } else if (req.body.password == "" || req.body.password == undefined) {
    res.status(400).json({ Message: "Password missing :: Enter again" });
    return;
  } else if (Evalid.validateEmailAddress(req.body.email) === -1) {
    res.status(400).json({ Message: "Incorrect email format :: Enter again" });
    return;
  } else if (req.body.password.length < 6) {
    res.status(400).json({
      Message: "Password length should be greater than 6 :: Enter again",
    });
    return;
  } else if (req.user.role == "admin" || req.user.role == "subadmin") {
    Users.findOne({ email: req.body.email }, (err, response) => {
      if (response) {
        res.status(400).json({
          Message: "This email address is already registered.. ",
        });
        return;
      } else {
        const UsEr = new Users({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: req.body.password,
        });
        const emil = req.body.email;
        const token = jwt.sign(
          { user_id: UsEr._id, emil },
          process.env.TOKEN_SECRET,
          {
            expiresIn: "5h",
          }
        );
        UsEr.save()
          .then((events) => {
            res.status(200).json({
              Message: `User registered`,
              Token: `${token}`,
            });
          })
          .catch((err) => {
            console.log(err);
            res.end();
          });
      }
    });
  } else {
    res
      .status(400)
      .json({ Message: "You are not authorized for this request" });
    return;
  }
};
exports.updateuser = async (req, res, next) => {
  if (req.body.firstname == "" || req.body.firstname == undefined) {
    res.status(400).json({ Message: "First name missing :: Enter again" });
    return;
  } else if (req.body.lastname == "" || req.body.lastname == undefined) {
    res.status(400).json({ Message: "Last name missing :: Enter again" });
    return;
  } else {
    Users.findOneAndUpdate(
      { email: req.user.emil },
      { firstname: req.body.firstname, lastname: req.body.lastname },
      (err, find) => {
        if (find) {
          res.status(200).json({ Message: "Updated..." });
          return;
        } else {
          res.status(404).json({ Message: "You are not our registered user" });
          return;
        }
      }
    );
  }
};
exports.listuser = async (req, res, next) => {
  if (
    req.user.role == "admin" ||
    req.user.role == "subadmin" ||
    req.user.role == "supervisor"
  ) {
    Users.findOne({ email: req.user.emil }, (err, find) => {
      if (find) {
        Users.find({}, (err, ufind) => {
          if (ufind && ufind != "") {
            res
              .status(200)
              .json({ Message: "All the users are: ", Data: ufind });
            return;
          } else {
            res.status(404).json({ Message: "No user Found" });
            return;
          }
        });
      } else {
        res.status(404).json({ Message: "You are not our registered user" });
        return;
      }
    });
  } else {
    res
      .status(400)
      .json({ Message: "You are not authorized for this request" });
    return;
  }
};
exports.viewuser = async (req, res, next) => {
  if (req.user.role == "admin" || req.user.role == "subadmin") {
    if ((req.body.role && !req.body.id) || (req.body.role && req.body.id)) {
      Users.find(
        { "Role_and_permissions.Role": req.body.role },
        (err, dfind) => {
          if (dfind && dfind != "") {
            res.status(200).json({ Message: "Your user is: ", data: dfind });
            return;
          } else {
            res.status(404).json({
              Message:
                "The Role provided does not belong to the user :: Enter again",
            });
            return;
          }
        }
      );
    } else if (req.body.id && !req.body.role) {
      Users.findOne({ _id: req.body.id }, (err, dfind) => {
        if (dfind) {
          res.status(200).json({ Message: "Your user is: ", data: dfind });
          return;
        } else {
          res.status(404).json({
            Message:
              "The id provided does not belong to the user :: Enter again",
          });
          return;
        }
      });
    } else if (!req.body.id && !req.body.role) {
      res.status(400).json({
        Message: "Missing ID or role :: Enter again",
      });
      return;
    }
  } else {
    res.status(400).json({
      Message: "You are not authorized for this requests.",
    });
    return;
  }
};
exports.deleteuser = async (req, res, next) => {
  if (req.user.role == "admin" || req.user.role == "subadmin") {
    if (req.body.id == "" || req.body.id == undefined) {
      res.status(400).json({ Message: "ID missing :: Enter again" });
      return;
    } else {
      Users.findOneAndDelete({ _id: req.body.id }, (err, dfind) => {
        if (dfind) {
          res.status(200).json({ Message: "User deleted" });
          return;
        } else {
          res.status(404).json({
            Message:
              "The id provided does not belong to the user :: Enter again",
          });
          return;
        }
      });
    }
  } else {
    res
      .status(400)
      .json({ Message: "You are not authorized for this request" });
    return;
  }
};
exports.Login = async (req, res, next) => {
  if (req.body.email == "" || req.body.email == undefined) {
    res.status(400).json({ Message: "Missing Email : Enter again" });
    return;
  } else if (req.body.password == "" || req.body.password == undefined) {
    res.status(400).json({ Message: "Missing Password : Enter again" });
    return;
  } else if (req.body.password.length < 6) {
    res
      .status(411)
      .json({ Message: "Password should be at least 6 characters" });
    return;
  } else if (Evalid.validateEmailAddress(req.body.email) === -1) {
    res.status(400).json({ Message: "Email format invalid  :: Enter again" });
    return;
  }
  Users.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      // user Found in record
      const verifypass = bcrypt.compareSync(req.body.password, user.password);
      if (verifypass == true) {
        const emil = req.body.email;
        const role = user.Role_and_permissions.Role;
        const token = jwt.sign(
          { user_id: user._id, emil, role },
          process.env.TOKEN_SECRET,
          {
            expiresIn: "5h",
          }
        );
        res.status(200).json({
          Message: `Login succesfull :: Welcome ${user.firstname}  ${user.lastname}  `,
          Token: `${token}`,
        });
      } else {
        res.status(400).json({
          Message: `Incorrect Credentials`,
        });
      }
    } else {
      res.status(400).json({ Message: "You are not our registered user" });
      return;
    }
  });
};
exports.updateUserstatus = async (req, res, next) => {
  if (req.user.role == "admin" || req.user.role == "subadmin") {
    if (req.body.status == "" || req.body.status == undefined) {
      res.status(400).json({
        Message: "Status Missing :: Enter again",
      });
      return;
    } else if (req.body.id == "" || req.body.id == undefined) {
      res.status(400).json({
        Message: "Id Missing :: Enter again",
      });
      return;
    } else {
      if (req.body.status == "active" || req.body.status == "inactive") {
        Users.findByIdAndUpdate(
          { _id: req.body.id },
          { status: req.body.status },
          (err, ufind) => {
            if (ufind) {
              res.status(404).json({
                Message: "Status Updated..",
                //   Data: ufind,
              });
              return;
            } else {
              res.status(404).json({
                Message:
                  "The id provided does not belong to the user :: Enter again",
              });
              return;
            }
          }
        );
      } else {
        res.status(400).json({
          Message: "The status should be 'active' or 'inactive' (lowercase)",
        });
        return;
      }
    }
  } else {
    res
      .status(400)
      .json({ Message: "You are not authorized for this request. ::" });
    return;
  }
};

exports.viewuserprofile = async (req, res) => {
  console.log(req.user.user_id);
  if (req.user.user_id == req.body.id) {
    Users.findOne({ _id: req.body.id }, (err, user) => {
      if (user) {
        res.status(200).send({ Message: "Your profile is :", User: user });
      } else {
        res
          .status(400)
          .json({ Message: "Your provided id record is not found" });
        return;
      }
    });
  } else {
    res
      .status(400)
      .json({ Message: "You are not authorized for this request. ::" });
    return;
  }
};

////////////////////      Roles and permission CRUD

exports.setRole = async (req, res, next) => {
  if (req.body.id == "" || req.body.id == undefined) {
    res.status(400).json({ Message: "ID missing :: Enter again" });
    return;
  } else if (req.body.role == "" || req.body.role == undefined) {
    res.status(400).json({ Message: "Missing user Role :: Enter again" });
    return;
  } else if (req.user.role == "admin" || req.user.role == "subadmin") {
    if (
      req.body.role == "user" ||
      req.body.role == "admin" ||
      req.body.role == "supervisor" ||
      req.body.role == "subadmin" ||
      req.body.role == "coustomer" ||
      req.body.role == "seller"
    ) {
      Users.findByIdAndUpdate(
        { _id: req.body.id },
        { "Role_and_permissions.Role": req.body.role },
        (err, rfind) => {
          if (rfind) {
            res.status(200).json({
              Message: "Role Updated",
            });
            return;
          } else {
            res.status(404).json({
              Message: "No user found for the provided ID",
            });
            return;
          }
        }
      );
    } else {
      res.status(400).json({
        Message: "The user rle can only be from one of these:",
        Roles: " user / admin / subadmin / coustomer / seller / supervisor ",
      });
      return;
    }
  } else {
    res
      .status(400)
      .json({ Message: "You are not authorized for this request" });
    return;
  }
};
// exports.setRole = async (req, res, next) => {};
// exports.setRole = async (req, res, next) => {};
