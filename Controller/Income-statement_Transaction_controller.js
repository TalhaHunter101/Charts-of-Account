const revenueSchema = require("../Models/Revenues");
const expenseSchema = require("../Models/Expenses");
const asetsSchema = require("../Models/Assets");
const equitySchema = require("../Models/Equity");
const liabilitySchema = require("../Models/Liabilities");
/// Transaction Schemas
const RevenueTransactionSchema = require("../Models/Transactions/R_Transaction");
const ExpenseTransactionSchema = require("../Models/Transactions/E_Transaction");
const EquityTransactionSchema = require("../Models/Transactions/Equity_Transaction");
const AssetsTransactionSchema = require("../Models/Transactions/Assets_Transaction");
const LiabilityTransactionSchema = require("../Models/Transactions/Liability_transaction");

const timeElapsed = Date.now();
const today = new Date(timeElapsed);

exports.addEquitytransfer = async (req, res, next) => {
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
    equitySchema.findById({ _id: req.body.source }).then((rfind) => {
      if (rfind) {
        const Revenueadded = new EquityTransactionSchema({
          Source: req.body.source,
          Destination: req.body.destination,
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
        Revenueadded.save();
        res.status(200).json({
          Message: "The revenue transaction is made",
          data: Revenueadded,
        });
      } else {
        res.status(400).json({
          Message: "No revenue account of this id found :: Enter again",
        });
        return;
      }
    });
  }
};

exports.generate_report = async (req, res, next) => {
  if (req.body.name == "" || req.body.name == undefined) {
    res.status(404).json({
      Message: "Missing name details",
    });
    return;
  } else if (req.body.name == "revenue") {
    revenueSchema.aggregate(
      [
        {
          $group: {
            _id: "_id",
            total: {
              $sum: "$Balance",
            },
          },
        },
      ],
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.status(200).json({
            Messages: "The total revenue is :  ",
            Data: result,
          });
        }
      }
    );
  } else if (req.body.name == "expense") {
    expenseSchema.aggregate(
      [
        {
          $group: {
            _id: "_id",
            total: {
              $sum: "$Balance",
            },
          },
        },
      ],
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.status(200).json({
            Messages: "The total expense is :  ",
            Data: result,
          });
        }
      }
    );
  } else if (req.body.name == "assets") {
    asetsSchema.aggregate(
      [
        {
          $group: {
            _id: "_id",
            total: {
              $sum: "$Balance",
            },
          },
        },
      ],
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.status(200).json({
            Messages: "The total assets is :  ",
            Data: result,
          });
        }
      }
    );
  } else if (req.body.name == "equity") {
    equitySchema.aggregate(
      [
        {
          $group: {
            _id: "_id",
            total: {
              $sum: "$Balance",
            },
          },
        },
      ],
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.status(200).json({
            Messages: "The total equity is :  ",
            Data: result,
          });
        }
      }
    );
  } else if (req.body.name == "liability") {
    liabilitySchema.aggregate(
      [
        {
          $group: {
            _id: "_id",
            total: {
              $sum: "$Balance",
            },
          },
        },
      ],
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.status(200).json({
            Messages: "The total liability is :  ",
            Data: result,
          });
        }
      }
    );
  } else {
    res.status(400).json({
      Message:
        ":: The input should be expense/ revenue / liability / equity / assets (lowercase) ::",
    });
    return;
  }
};
