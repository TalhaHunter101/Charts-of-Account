const Assets = require("../Models/Assets");
const Equity = require("../Models/Equity");
const Liability = require("../Models/Liabilities");
const buildAncestors = async (id, parent_id) => {
  let ancest = [];
  try {
    let parent_Revenue = await Revenue.findOne(
      { _id: parent_id },
      { name: 1, slug: 1, ancestors: 1 }
    ).exec();

    if (parent_Revenue) {
      const { _id, name, slug } = parent_Revenue;
      const ancest = [...parent_Revenue.ancestors];
      ancest.unshift({ _id, name, slug });
      await Revenue.findByIdAndUpdate(id, {
        $set: { ancestors: ancest },
      });
    } else {
      return res
        .status(400)
        .json({ message: "Parent not found in the record" });
    }
  } catch (err) {
    console.log(err.message);
  }
};

///////////////////// For Assets //

exports.addAssetsaccount = async (req, res, next) => {
  if (req.body.name == "" || req.body.name == undefined) {
    res.status(400).send({ Message: "Missing Name :: Enter again" });
  } else {
    Assets.findOne({ name: req.body.name }, async (err, find) => {
      if (find) {
        res.status(400).send({
          Message: "Your Account of this name already present already ",
        });
        return;
      } else {
        let parent = req.body.parent ? req.body.parent : null;
        if (parent != null) {
          Assets.findOne({ _id: parent }, async (err, findd) => {
            if (!findd) {
              res.status(400).send({
                Message: "Your provided parent id is not present ",
              });
              return;
            } else {
              const revenuee = new Assets({ name: req.body.name, parent });
              let newrevenue = await revenuee.save();
              buildAncestors(newrevenue._id, parent);
              res.status(201).send({ response: newrevenue });
              return;
            }
          });
        } else {
          Assets.findOne({ parent: null }, async (err, dfind) => {
            if (dfind) {
              res.status(400).send({
                Message: "Super parent already present",
              });
              return;
            } else {
              const revenuee = new Assets({ name: req.body.name, parent });
              let newrevenue = await revenuee.save();
              buildAncestors(newrevenue._id, parent);
              res.status(201).send({ response: newrevenue });
              return;
            }
          });
        }
      }
    });
  }
};
// change revenue account
exports.updateAssetsaccount = async (req, res, next) => {
  if (req.body.id == "" || req.body.id == undefined) {
    res.status(400).send({ Message: "Id missing  :: Enter again" });
    return;
  } else if (req.body.name == "" || req.body.name == undefined) {
    res
      .status(400)
      .send({ Message: "Name for update is missing  :: Enter again" });
    return;
  } else {
    Assets.find({ name: req.body.name }, async (err, find) => {
      if (find && find != "") {
        res
          .status(400)
          .send({ Message: "Revenue account by this name already present" });
        return;
      } else {
        await Assets.findByIdAndUpdate(
          { _id: req.body.id },
          { name: req.body.name }
        ).then((found) => {
          if (found) {
            res
              .status(200)
              .send({ Message: "Revenue account updated", Data: found });
            return;
          } else {
            res.status(404).send({ Message: "Account is not found" });
            return;
          }
        });
      }
    });
  }
};
// delete revenue account from
exports.deleteAssetsaccount = async (req, res) => {
  if (req.body.id == "" || req.body.id == undefined) {
    res.status(400).send({ Message: "Id missing  :: Enter again" });
  } else {
    Assets.findByIdAndDelete({ _id: req.body.id }, async (err, find) => {
      if (find) {
        await Assets.deleteMany({ parent: req.body.id });
        res.status(200).send({ Message: "Account deleted" });
      } else {
        res.status(404).send({ Message: "Account by this Id not found" });
      }
    });
  }
};
// read all accounts
exports.readallAssetsaccounts = async (req, res) => {
  if (req.body.name) {
    Assets.find(
      { name: { $regex: new RegExp(req.body.name, "i") } },
      (err, ename) => {
        if (ename && ename != "") {
          res.status(200).json({
            Message: "All the accounts with these names are : ",
            data: ename,
          });
        } else {
          res.status(404).json({
            Message: "No account with this name found",
          });
        }
      }
    );
  } else {
    Assets.find({}, (err, ename) => {
      if (ename) {
        res.status(200).json({
          Message: "All the accounts are : ",
          data: ename,
        });
      } else {
        res.status(404).json({
          Message: "No account found",
        });
      }
    });
  }
};

////////////////For Equity

exports.addEquityaccount = async (req, res, next) => {
  if (req.body.name == "" || req.body.name == undefined) {
    res.status(400).send({ Message: "Missing Name :: Enter again" });
  } else {
    Equity.findOne({ name: req.body.name }, async (err, find) => {
      if (find) {
        res.status(400).send({
          Message: "Your Account of this name already present already ",
        });
        return;
      } else {
        let parent = req.body.parent ? req.body.parent : null;
        if (parent != null) {
          Equity.findOne({ _id: parent }, async (err, findd) => {
            if (!findd) {
              res.status(400).send({
                Message: "Your provided parent id is not present ",
              });
              return;
            } else {
              const revenuee = new Equity({ name: req.body.name, parent });
              let newrevenue = await revenuee.save();
              buildAncestors(newrevenue._id, parent);
              res.status(201).send({ response: newrevenue });
              return;
            }
          });
        } else {
          Equity.findOne({ parent: null }, async (err, dfind) => {
            if (dfind) {
              res.status(400).send({
                Message: "Super parent already present",
              });
              return;
            } else {
              const revenuee = new Equity({ name: req.body.name, parent });
              let newrevenue = await revenuee.save();
              buildAncestors(newrevenue._id, parent);
              res.status(201).send({ response: newrevenue });
              return;
            }
          });
        }
      }
    });
  }
};
// change revenue account
exports.updateEquityaccount = async (req, res, next) => {
  if (req.body.id == "" || req.body.id == undefined) {
    res.status(400).send({ Message: "Id missing  :: Enter again" });
    return;
  } else if (req.body.name == "" || req.body.name == undefined) {
    res
      .status(400)
      .send({ Message: "Name for update is missing  :: Enter again" });
    return;
  } else {
    Equity.find({ name: req.body.name }, async (err, find) => {
      if (find && find != "") {
        res
          .status(400)
          .send({ Message: "Revenue account by this name already present" });
        return;
      } else {
        await Equity.findByIdAndUpdate(
          { _id: req.body.id },
          { name: req.body.name }
        ).then((found) => {
          if (found) {
            res
              .status(200)
              .send({ Message: "Revenue account updated", Data: found });
            return;
          } else {
            res.status(404).send({ Message: "Account is not found" });
            return;
          }
        });
      }
    });
  }
};
// delete revenue account from
exports.deleteEquityaccount = async (req, res) => {
  if (req.body.id == "" || req.body.id == undefined) {
    res.status(400).send({ Message: "Id missing  :: Enter again" });
  } else {
    Equity.findByIdAndDelete({ _id: req.body.id }, async (err, find) => {
      if (find) {
        await Equity.deleteMany({ parent: req.body.id });
        res.status(200).send({ Message: "Account deleted" });
      } else {
        res.status(404).send({ Message: "Account by this Id not found" });
      }
    });
  }
};
// read all accounts
exports.readallEquityaccounts = async (req, res) => {
  if (req.body.name) {
    Equity.find(
      { name: { $regex: new RegExp(req.body.name, "i") } },
      (err, ename) => {
        if (ename && ename != "") {
          res.status(200).json({
            Message: "All the accounts with these names are : ",
            data: ename,
          });
        } else {
          res.status(404).json({
            Message: "No account with this name found",
          });
        }
      }
    );
  } else {
    Equity.find({}, (err, ename) => {
      if (ename) {
        res.status(200).json({
          Message: "All the accounts are : ",
          data: ename,
        });
      } else {
        res.status(404).json({
          Message: "No account found",
        });
      }
    });
  }
};

/////////////////////For liability

exports.addLiabilityaccount = async (req, res, next) => {
  if (req.body.name == "" || req.body.name == undefined) {
    res.status(400).send({ Message: "Missing Name :: Enter again" });
  } else {
    Liability.findOne({ name: req.body.name }, async (err, find) => {
      if (find) {
        res.status(400).send({
          Message: "Your Account of this name already present already ",
        });
        return;
      } else {
        let parent = req.body.parent ? req.body.parent : null;
        if (parent != null) {
          Liability.findOne({ _id: parent }, async (err, findd) => {
            if (!findd) {
              res.status(400).send({
                Message: "Your provided parent id is not present ",
              });
              return;
            } else {
              const revenuee = new Liability({ name: req.body.name, parent });
              let newrevenue = await revenuee.save();
              buildAncestors(newrevenue._id, parent);
              res.status(201).send({ response: newrevenue });
              return;
            }
          });
        } else {
          Liability.findOne({ parent: null }, async (err, dfind) => {
            if (dfind) {
              res.status(400).send({
                Message: "Super parent already present",
              });
              return;
            } else {
              const revenuee = new Liability({ name: req.body.name, parent });
              let newrevenue = await revenuee.save();
              buildAncestors(newrevenue._id, parent);
              res.status(201).send({ response: newrevenue });
              return;
            }
          });
        }
      }
    });
  }
};
// change revenue account
exports.updateLiabilityaccount = async (req, res, next) => {
  if (req.body.id == "" || req.body.id == undefined) {
    res.status(400).send({ Message: "Id missing  :: Enter again" });
    return;
  } else if (req.body.name == "" || req.body.name == undefined) {
    res
      .status(400)
      .send({ Message: "Name for update is missing  :: Enter again" });
    return;
  } else {
    Liability.find({ name: req.body.name }, async (err, find) => {
      if (find && find != "") {
        res
          .status(400)
          .send({ Message: "Revenue account by this name already present" });
        return;
      } else {
        await Liability.findByIdAndUpdate(
          { _id: req.body.id },
          { name: req.body.name }
        ).then((found) => {
          if (found) {
            res
              .status(200)
              .send({ Message: "Revenue account updated", Data: found });
            return;
          } else {
            res.status(404).send({ Message: "Account is not found" });
            return;
          }
        });
      }
    });
  }
};
// delete revenue account from
exports.deleteLiabilityaccount = async (req, res) => {
  if (req.body.id == "" || req.body.id == undefined) {
    res.status(400).send({ Message: "Id missing  :: Enter again" });
  } else {
    Liability.findByIdAndDelete({ _id: req.body.id }, async (err, find) => {
      if (find) {
        await Liability.deleteMany({ parent: req.body.id });
        res.status(200).send({ Message: "Account deleted" });
      } else {
        res.status(404).send({ Message: "Account by this Id not found" });
      }
    });
  }
};
// read all accounts
exports.readallLiabilityaccounts = async (req, res) => {
  if (req.body.name) {
    Liability.find(
      { name: { $regex: new RegExp(req.body.name, "i") } },
      (err, ename) => {
        if (ename && ename != "") {
          res.status(200).json({
            Message: "All the accounts with these names are : ",
            data: ename,
          });
        } else {
          res.status(404).json({
            Message: "No account with this name found",
          });
        }
      }
    );
  } else {
    Liability.find({}, (err, ename) => {
      if (ename) {
        res.status(200).json({
          Message: "All the accounts are : ",
          data: ename,
        });
      } else {
        res.status(404).json({
          Message: "No account found",
        });
      }
    });
  }
};
