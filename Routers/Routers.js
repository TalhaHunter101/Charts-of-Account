const express = require("express");
const router = express.Router();
const B_Controller = require("../Controller/Balance-Sheet-controller");
const I_Controller = require("../Controller/Income-statement-controller");
router.use(
  express.urlencoded({
    extended: true,
  })
);

//routing User  to controller

// For revenue
router.post("/addrevenueaccount", B_Controller.addrevenueaccount);
router.delete("/deleterevenueaccount", B_Controller.deleteaccount);
router.put("/updaterevenueaccount", B_Controller.updaterevenueaccount);
router.get("/readallaccounts", B_Controller.readallaccounts);

// For Expense
router.post("/addexpenseaccount", B_Controller.addexpenseaccount);
router.delete("/deleteexpenseaccount", B_Controller.deleteexpenseaccount);
router.put("/updateexpenseaccount", B_Controller.updateexpenseaccount);
router.get("/readexpenseallaccounts", B_Controller.readexpenseallaccounts);

// For Liability
router.post("/addLiabilityaccount", I_Controller.addLiabilityaccount);
router.delete("/deleteLiabilityaccount", I_Controller.deleteLiabilityaccount);
router.put("/deleteLiabilityaccount", I_Controller.updateLiabilityaccount);
router.get("/readallLiabilityaccounts", I_Controller.readallLiabilityaccounts);

// For Equity
router.post("/addEquityaccount", I_Controller.addEquityaccount);
router.delete("/deleteEquityaccount", I_Controller.deleteEquityaccount);
router.put("/updateEquityaccount", I_Controller.updateEquityaccount);
router.get("/readallEquityaccounts", I_Controller.readallEquityaccounts);

// For Assets
router.post("/addAssetsaccount", I_Controller.addAssetsaccount);
router.delete("/deleteAssetsaccount", I_Controller.deleteAssetsaccount);
router.put("/updateAssetsaccount", I_Controller.updateAssetsaccount);
router.get("/readallAssetsaccounts", I_Controller.readallAssetsaccounts);

module.exports = router;
