const Revenue = require("../Models/Revenues");
const Expenses = require("../Models/Expenses");
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
////////////////////////////////////////////For REvenues///////////////////////////////
// Create revenue account
exports.addrevenueaccount = async (req, res, next) => {
  if (req.body.name == "" || req.body.name == undefined) {
    res.status(400).send({ Message: "Missing Name :: Enter again" });
  } else {
    Revenue.findOne({ name: req.body.name }, async (err, find) => {
      if (find) {
        res.status(400).send({
          Message: "Your Account of this name already present already ",
        });
        return;
      } else {
        let parent = req.body.parent ? req.body.parent : null;
        if (parent != null) {
          Revenue.findOne({ _id: parent }, async (err, findd) => {
            if (!findd) {
              res.status(400).send({
                Message: "Your provided parent id is not present ",
              });
              return;
            } else {
              const revenuee = new Revenue({ name: req.body.name, parent });
              let newrevenue = await revenuee.save();
              buildAncestors(newrevenue._id, parent);
              res.status(201).send({ response: newrevenue });
              return;
            }
          });
        } else {
          Revenue.findOne({ parent: null }, async (err, dfind) => {
            if (dfind) {
              res.status(400).send({
                Message: "Super parent already present",
              });
              return;
            } else {
              const revenuee = new Revenue({ name: req.body.name, parent });
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
exports.updaterevenueaccount = async (req, res, next) => {
  if (req.body.id == "" || req.body.id == undefined) {
    res.status(400).send({ Message: "Id missing  :: Enter again" });
    return;
  } else if (req.body.name == "" || req.body.name == undefined) {
    res
      .status(400)
      .send({ Message: "Name for update is missing  :: Enter again" });
    return;
  } else {
    Revenue.find({ name: req.body.name }, async (err, find) => {
      if (find && find != "") {
        res
          .status(400)
          .send({ Message: "Revenue account by this name already present" });
        return;
      } else {
        await Revenue.findByIdAndUpdate(
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

exports.deleteaccount = async (req, res) => {
  if (req.body.id == "" || req.body.id == undefined) {
    res.status(400).send({ Message: "Id missing  :: Enter again" });
  } else {
    Revenue.findByIdAndDelete({ _id: req.body.id }, async (err, find) => {
      if (find) {
        await Revenue.deleteMany({ parent: req.body.id });
        res.status(200).send({ Message: "Account deleted" });
      } else {
        res.status(404).send({ Message: "Account by this Id not found" });
      }
    });
  }
};

// read all accounts

exports.readallaccounts = async (req, res) => {
  if (req.body.name) {
    Revenue.find(
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
    Revenue.find({}, (err, ename) => {
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

/////////////////////////////For Expenses //////////////////////////////////////
exports.addexpenseaccount = async (req, res, next) => {
  if (req.body.name == "" || req.body.name == undefined) {
    res.status(400).send({ Message: "Missing Name :: Enter again" });
  } else {
    Expenses.findOne({ name: req.body.name }, async (err, find) => {
      if (find) {
        res.status(400).send({
          Message: "Your Account of this name already present already ",
        });
        return;
      } else {
        let parent = req.body.parent ? req.body.parent : null;
        if (parent != null) {
          Expenses.findOne({ _id: parent }, async (err, findd) => {
            if (!findd) {
              res.status(400).send({
                Message: "Your provided parent id is not present ",
              });
              return;
            } else {
              const Expenseses = new Expenses({ name: req.body.name, parent });
              let newexpense = await Expenseses.save();
              buildAncestors(newexpense._id, parent);
              res.status(201).send({ response: newexpense });
              return;
            }
          });
        } else {
          Expenses.findOne({ parent: null }, async (err, dfind) => {
            if (dfind) {
              res.status(400).send({
                Message: "Super parent already present",
              });
              return;
            } else {
              const revenuee = new Expenses({ name: req.body.name, parent });
              let newexpense = await revenuee.save();
              buildAncestors(newexpense._id, parent);
              res.status(201).send({ response: newexpense });
              return;
            }
          });
        }
      }
    });
  }
};

// change revenue account
exports.updateexpenseaccount = async (req, res, next) => {
  if (req.body.id == "" || req.body.id == undefined) {
    res.status(400).send({ Message: "Id missing  :: Enter again" });
    return;
  } else if (req.body.name == "" || req.body.name == undefined) {
    res
      .status(400)
      .send({ Message: "Name for update is missing  :: Enter again" });
    return;
  } else {
    Expenses.find({ name: req.body.name }, async (err, find) => {
      if (find && find != "") {
        res
          .status(400)
          .send({ Message: "Revenue account by this name already present" });
        return;
      } else {
        await Expenses.findByIdAndUpdate(
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

exports.deleteexpenseaccount = async (req, res) => {
  if (req.body.id == "" || req.body.id == undefined) {
    res.status(400).send({ Message: "Id missing  :: Enter again" });
  } else {
    Expenses.findByIdAndDelete({ _id: req.body.id }, async (err, find) => {
      if (find) {
        await Expenses.deleteMany({ parent: req.body.id });
        res.status(200).send({ Message: "Account deleted" });
      } else {
        res.status(404).send({ Message: "Account by this Id not found" });
      }
    });
  }
};

// read all accounts

exports.readexpenseallaccounts = async (req, res) => {
  if (req.body.name) {
    Expenses.find(
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
    Expenses.find({}, (err, ename) => {
      if (ename && ename != "") {
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
