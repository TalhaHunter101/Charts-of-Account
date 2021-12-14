const revenueSchema = require("../Models/Revenues");
const expenseSchema = require("../Models/Expenses");
const asetsSchema = require("../Models/Assets");
const equitySchema = require("../Models/Equity");
const liabilitySchema = require("../Models/Liabilities");
/// Transaction Schemas
const RevenueTransactionSchema = require("../Models/Transactions/R_Transaction");
const ExpenseTransactionSchema = require("../Models/Transactions/E_Transaction");
// const EquityTransactionSchema = require("../Models/Transactions/Equity_Transaction");
// const AssetsTransactionSchema = require("../Models/Transactions/Assets_Transaction");
// const LiabilityTransactionSchema = require("../Models/Transactions/Liability_transaction");

const timeElapsed = Date.now();
const today = new Date(timeElapsed);

/// Add Revenue

exports.addRevenue = async (req, res, next) => {
  if (req.body.source == undefined || req.body.source == "") {
    res.status(400).json({ Message: "Source Account missing :: Enter again" });
    return;
  } else if (req.body.destination == undefined || req.body.destination == "") {
    res
      .status(400)
      .json({ Message: "Destination Account missing :: Enter again" });
    return;
  } else if (req.body.amount == undefined || req.body.amount == "") {
    res
      .status(400)
      .json({ Message: "Ammount transaction missing :: Enter again" });
    return;
  } else if (req.body.description == undefined || req.body.description == "") {
    res
      .status(400)
      .json({ Message: "Transaction description missing :: Enter again" });
    return;
  } else if (req.body.category == undefined || req.body.category == "") {
    res
      .status(400)
      .json({ Message: "Transaction category missing :: Enter again" });
    return;
  } else {
    asetsSchema.findById({ _id: req.body.source }).then((rfind) => {
      if (rfind) {
        revenueSchema.findById({ _id: req.body.destination }, (err, efind) => {
          if (efind) {
            const Revenueadded = new RevenueTransactionSchema({
              Deposited_To: req.body.source,
              Destination: req.body.destination, // category
              Transaction: {
                Ammount: req.body.amount,
                Date: today.toLocaleDateString(),
                Description: req.body.description,
                Category: req.body.category,
              },
            }); /// adding revenue to category
            /// minus from asssetd and add to revenue transaction
            rfind.Balance += req.body.amount;
            rfind.Transaction.push(Revenueadded._id);
            rfind.save();
            efind.Balance += req.body.amount;
            efind.Transaction.push(Revenueadded._id);
            efind.save();
            Revenueadded.save();
            res.status(200).json({
              Message: "The Assets revenue transaction is made",
              data: Revenueadded,
            });
          } else {
            res.status(400).json({
              Message: "No revenue account of this id found :: Enter again",
            });
            return;
          }
        });
      } else {
        equitySchema.findById({ _id: req.body.source }).then((rfind) => {
          if (rfind) {
            revenueSchema.findById(
              { _id: req.body.destination },
              (err, efind) => {
                if (efind) {
                  const Revenueadded = new RevenueTransactionSchema({
                    Deposited_To: req.body.source,
                    Destination: req.body.destination, // category
                    Transaction: {
                      Ammount: req.body.amount,
                      Date: today.toLocaleDateString(),
                      Description: req.body.description,
                      Category: req.body.category,
                    },
                  });
                  rfind.Balance += req.body.amount;
                  rfind.Transaction.push(Revenueadded._id);
                  rfind.save();
                  efind.Balance += req.body.amount;
                  efind.Transaction.push(Revenueadded._id);
                  efind.save();
                  Revenueadded.save();
                  res.status(200).json({
                    Message: "The Equity revenue transaction is made",
                    data: Revenueadded,
                  });
                } else {
                  res.status(400).json({
                    Message:
                      "No revenue account of this id found :: Enter again",
                  });
                  return;
                }
              }
            );
          } else {
            liabilitySchema.findById({ _id: req.body.source }).then((rfind) => {
              if (rfind) {
                revenueSchema.findById(
                  { _id: req.body.destination },
                  (err, efind) => {
                    if (efind) {
                      const Revenueadded = new RevenueTransactionSchema({
                        Deposited_To: req.body.source,
                        Destination: req.body.destination, // category
                        Transaction: {
                          Ammount: req.body.amount,
                          Date: today.toLocaleDateString(),
                          Description: req.body.description,
                          Category: req.body.category,
                        },
                      });
                      rfind.Balance -= req.body.amount;
                      rfind.Transaction.push(Revenueadded._id);
                      rfind.save();
                      efind.Balance += req.body.amount;
                      efind.Transaction.push(Revenueadded._id);
                      efind.save();
                      Revenueadded.save();
                      res.status(200).json({
                        Message: "The Liability revenue transaction is made",
                        data: Revenueadded,
                      });
                    } else {
                      res.status(400).json({
                        Message:
                          "No revenue account of this id found :: Enter again",
                      });
                      return;
                    }
                  }
                );
              } else {
                res.status(400).json({
                  Message:
                    "No asset/equity/liability schema made account of this id found :: Enter again",
                });
                return;
              }
            });
          }
        });
      }
    });
  }
};

exports.updaterevenue = async (req, res, next) => {
  if (req.body.id == undefined || req.body.id == "") {
    res.status(400).json({ Message: "Account id missing :: Enter again" });
    return;
  } else if (req.body.amount == undefined || req.body.amount == "") {
    res
      .status(400)
      .json({ Message: "Ammount transaction missing :: Enter again" });
    return;
  } else if (req.body.description == undefined || req.body.description == "") {
    res
      .status(400)
      .json({ Message: "Transaction description missing :: Enter again" });
    return;
  } else if (req.body.category == undefined || req.body.category == "") {
    res
      .status(400)
      .json({ Message: "Transaction category missing :: Enter again" });
    return;
  } else {
    RevenueTransactionSchema.findByIdAndUpdate(
      { _id: req.body.id },
      {
        Transaction: {
          Ammount: req.body.amount,
          DateModified: today.toLocaleDateString(),
          Description: req.body.description,
          Category: req.body.category,
        },
      }
    ).then((ufind) => {
      if (ufind) {
        revenueSchema.findById({ _id: ufind.Source }, (err, found) => {
          if (found) {
            found.Balance = found.Balance - ufind.Transaction.Ammount;
            found.Balance = +req.body.amount;
            found.save();
            res.status(200).json({ Message: "Transaction Updated" });
            return;
          }
        });
      } else {
        res
          .status(404)
          .json({ Message: "No transaction found for your provided id" });
        return;
      }
    });
  }
};

exports.deleterevenue = async (req, res, next) => {
  if (req.body.id == undefined || req.body.id == "") {
    res.status(400).json({ Message: "Account id missing :: Enter again" });
    return;
  } else {
    RevenueTransactionSchema.findByIdAndDelete({ _id: req.body.id }).then(
      (dfind) => {
        if (dfind) {
          revenueSchema.findById({ _id: dfind.Source }, (err, found) => {
            if (found) {
              found.Balance = found.Balance - dfind.Transaction.Ammount;

              found.Transaction.pull(dfind._id);
              found.save();
              res.status(200).json({ Message: "Transaction deleted" });
              return;
            }
          });
        } else {
          res
            .status(404)
            .json({ Message: "The transaction not found for the provided id" });
          return;
        }
      }
    );
  }
};

exports.readrevenue = async (req, res) => {
  if (req.body.category && !req.body.source) {
    RevenueTransactionSchema.find(
      {
        "Transaction.Category": { $regex: new RegExp(req.body.category, "i") },
      },
      (err, find) => {
        if (find && find != "") {
          res.status(200).json({ Message: "Transaction are:", Data: find });
          return;
        } else {
          res.status(404).json({ Message: "No transaction records found" });
          return;
        }
      }
    );
  } else if (req.body.source && !req.body.category) {
    RevenueTransactionSchema.find(
      {
        Source: req.body.source,
      },
      (err, find) => {
        if (find && find != "") {
          res.status(200).json({
            Message: "Transaction for provided source accounts are: ",
            Data: find,
          });
          return;
        } else {
          res.status(404).json({ Message: "No transaction records found" });
          return;
        }
      }
    );
  } else if (req.body.source && req.body.category) {
    RevenueTransactionSchema.find(
      {
        Source: req.body.source,
        "Transaction.Category": { $regex: new RegExp(req.body.category, "i") },
      },
      (err, find) => {
        if (find && find != "") {
          res.status(200).json({
            Message: "Transaction for provided source accounts are: ",
            Data: find,
          });
          return;
        } else {
          res.status(404).json({ Message: "No transaction records found" });
          return;
        }
      }
    );
  } else {
    RevenueTransactionSchema.find({}, (err, find) => {
      if (find && find != "") {
        res.status(200).json({ Message: "Transaction are:", Data: find });
        return;
      } else {
        res.status(404).json({ Message: "No transaction records found" });
        return;
      }
    });
  }
};

/// Add Expense////////////      expenseSchema          /////////////////////      ExpenseTransactionSchema

/// General

exports.addExpense = async (req, res, next) => {
  if (req.body.source == undefined || req.body.source == "") {
    res.status(400).json({ Message: "Source Account missing :: Enter again" });
    return;
  } else if (req.body.destination == undefined || req.body.destination == "") {
    res
      .status(400)
      .json({ Message: "Destination Account missing :: Enter again" });
    return;
  } else if (req.body.amount == undefined || req.body.amount == "") {
    res
      .status(400)
      .json({ Message: "Amount transaction missing :: Enter again" });
    return;
  } else if (req.body.description == undefined || req.body.description == "") {
    res
      .status(400)
      .json({ Message: "Transaction description missing :: Enter again" });
    return;
  } else if (req.body.category == undefined || req.body.category == "") {
    res
      .status(400)
      .json({ Message: "Transaction category missing :: Enter again" });
    return;
  } else {
    asetsSchema.findById({ _id: req.body.source }).then((rfind) => {
      if (rfind) {
        expenseSchema.findById({ _id: req.body.destination }, (err, efind) => {
          if (efind) {
            const Expenseadded = new ExpenseTransactionSchema({
              Deposited_To: req.body.source,
              Destination: req.body.destination, // category
              Transaction: {
                Ammount: req.body.amount,
                Date: today.toLocaleDateString(),
                Description: req.body.description,
                Category: req.body.category,
              },
            }); /// adding revenue to category
            /// minus from asssetd and add to revenue transaction
            rfind.Balance -= req.body.amount;
            rfind.Transaction.push(Expenseadded._id);
            rfind.save();
            efind.Balance += req.body.amount;
            efind.Transaction.push(Expenseadded._id);
            efind.save();
            Expenseadded.save();
            res.status(200).json({
              Message: "The Assets revenue transaction is made",
              data: Expenseadded,
            });
          } else {
            res.status(400).json({
              Message: "No revenue account of this id found :: Enter again",
            });
            return;
          }
        });
      } else {
        equitySchema.findById({ _id: req.body.source }).then((rfind) => {
          if (rfind) {
            expenseSchema.findById(
              { _id: req.body.destination },
              (err, efind) => {
                if (efind) {
                  const Expenseadded = new ExpenseTransactionSchema({
                    Deposited_To: req.body.source,
                    Destination: req.body.destination, // category
                    Transaction: {
                      Ammount: req.body.amount,
                      Date: today.toLocaleDateString(),
                      Description: req.body.description,
                      Category: req.body.category,
                    },
                  });
                  rfind.Balance -= req.body.amount;
                  rfind.Transaction.push(Expenseadded._id);
                  rfind.save();
                  efind.Balance += req.body.amount;
                  efind.Transaction.push(Expenseadded._id);
                  efind.save();
                  Expenseadded.save();
                  res.status(200).json({
                    Message: "The Equity revenue transaction is made",
                    data: Expenseadded,
                  });
                } else {
                  res.status(400).json({
                    Message:
                      "No revenue account of this id found :: Enter again",
                  });
                  return;
                }
              }
            );
          } else {
            liabilitySchema.findById({ _id: req.body.source }).then((rfind) => {
              if (rfind) {
                expenseSchema.findById(
                  { _id: req.body.destination },
                  (err, efind) => {
                    if (efind) {
                      const Expenseadded = new ExpenseTransactionSchema({
                        Deposited_To: req.body.source,
                        Destination: req.body.destination, // category
                        Transaction: {
                          Ammount: req.body.amount,
                          Date: today.toLocaleDateString(),
                          Description: req.body.description,
                          Category: req.body.category,
                        },
                      });
                      rfind.Balance += req.body.amount;
                      rfind.Transaction.push(Expenseadded._id);
                      rfind.save();
                      efind.Balance += req.body.amount;
                      efind.Transaction.push(Expenseadded._id);
                      efind.save();
                      Expenseadded.save();
                      res.status(200).json({
                        Message: "The Liability revenue transaction is made",
                        data: Expenseadded,
                      });
                    } else {
                      res.status(400).json({
                        Message:
                          "No revenue account of this id found :: Enter again",
                      });
                      return;
                    }
                  }
                );
              } else {
                res.status(400).json({
                  Message:
                    "No asset/equity/liability schema made account of this id found :: Enter again",
                });
                return;
              }
            });
          }
        });
      }
    });
  }
};

exports.updateExpense = async (req, res, next) => {
  if (req.body.id == undefined || req.body.id == "") {
    res.status(400).json({ Message: "Account id missing :: Enter again" });
    return;
  } else if (req.body.amount == undefined || req.body.amount == "") {
    res
      .status(400)
      .json({ Message: "Ammount transaction missing :: Enter again" });
    return;
  } else if (req.body.description == undefined || req.body.description == "") {
    res
      .status(400)
      .json({ Message: "Transaction description missing :: Enter again" });
    return;
  } else if (req.body.category == undefined || req.body.category == "") {
    res
      .status(400)
      .json({ Message: "Transaction category missing :: Enter again" });
    return;
  } else {
    ExpenseTransactionSchema.findByIdAndUpdate(
      { _id: req.body.id },
      {
        Transaction: {
          Ammount: req.body.amount,
          DateModified: today.toLocaleDateString(),
          Description: req.body.description,
          Category: req.body.category,
        },
      }
    ).then((ufind) => {
      if (ufind) {
        expenseSchema.findById({ _id: ufind.Paid_from }, (err, found) => {
          if (found) {
            found.Balance = found.Balance - ufind.Transaction.Ammount;
            found.Balance = +req.body.amount;
            found.save();
            res.status(200).json({ Message: "Transaction Updated" });
            return;
          }
        });
      } else {
        res
          .status(404)
          .json({ Message: "No transaction found for your provided id" });
        return;
      }
    });
  }
};

exports.deleteExpense = async (req, res, next) => {
  if (req.body.id == undefined || req.body.id == "") {
    res.status(400).json({ Message: "Account id missing :: Enter again" });
    return;
  } else {
    ExpenseTransactionSchema.findByIdAndDelete({ _id: req.body.id }).then(
      (dfind) => {
        if (dfind) {
          expenseSchema.findById({ _id: dfind.Paid_from }, (err, found) => {
            if (found) {
              found.Balance = found.Balance - dfind.Transaction.Ammount;
              found.Transaction.pull(dfind._id);
              found.save();
              res.status(200).json({ Message: "Transaction deleted" });
              return;
            }
          });
        } else {
          res
            .status(404)
            .json({ Message: "The transaction not found for the provided id" });
          return;
        }
      }
    );
  }
};

exports.readExpense = async (req, res) => {
  if (req.body.category && !req.body.source) {
    ExpenseTransactionSchema.find(
      {
        "Transaction.Category": { $regex: new RegExp(req.body.category, "i") },
      },
      (err, find) => {
        if (find && find != "") {
          res.status(200).json({ Message: "Transaction are:", Data: find });
          return;
        } else {
          res.status(404).json({ Message: "No transaction records found" });
          return;
        }
      }
    );
  } else if (req.body.source && !req.body.category) {
    ExpenseTransactionSchema.find(
      {
        Paid_from: req.body.source,
      },
      (err, find) => {
        if (find && find != "") {
          res.status(200).json({
            Message: "Transaction for provided source accounts are: ",
            Data: find,
          });
          return;
        } else {
          res.status(404).json({ Message: "No transaction records found" });
          return;
        }
      }
    );
  } else if (req.body.source && req.body.category) {
    ExpenseTransactionSchema.find(
      {
        Paid_from: req.body.source,
        "Transaction.Category": { $regex: new RegExp(req.body.category, "i") },
      },
      (err, find) => {
        if (find && find != "") {
          res.status(200).json({
            Message: "Transaction for provided source accounts are: ",
            Data: find,
          });
          return;
        } else {
          res.status(404).json({ Message: "No transaction records found" });
          return;
        }
      }
    );
  } else {
    ExpenseTransactionSchema.find({}, (err, find) => {
      if (find && find != "") {
        res.status(200).json({ Message: "Transaction are:", Data: find });
        return;
      } else {
        res.status(404).json({ Message: "No transaction records found" });
        return;
      }
    });
  }
};
