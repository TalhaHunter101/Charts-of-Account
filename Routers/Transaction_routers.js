const express = require("express");
const router = express.Router();
const Transaction_Controller = require("../Controller/Balancesheet_Transaction_Controller");
const Income_Transaction_Controller = require("../Controller/Income-statement_Transaction_controller");
router.use(
  express.urlencoded({
    extended: true,
  })
);
router.post("/addrevenue", Transaction_Controller.addRevenue);
router.put("/updaterevenue", Transaction_Controller.updaterevenue);
router.delete("/deleterevenue", Transaction_Controller.deleterevenue);
router.get("/readrevenue", Transaction_Controller.readrevenue);

router.post("/addexpense", Transaction_Controller.addExpense);
router.put("/updateexpense", Transaction_Controller.updateExpense);
router.delete("/deleteexpense", Transaction_Controller.deleteExpense);
router.get("/readexpense", Transaction_Controller.readExpense);

router.post(
  "/addequitytransfer",
  Income_Transaction_Controller.addEquitytransfer
);
router.get(
  "/generate_reports",
  Income_Transaction_Controller.generate_report
);





module.exports = router;
