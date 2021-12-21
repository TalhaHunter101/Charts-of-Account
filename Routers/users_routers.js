const express = require("express");
const router = express.Router();
const usercontroller = require("../Controller/User_controller");
const auth = require("../Middleware/auth");
router.use(
  express.urlencoded({
    extended: true,
  })
);

/////////////////////////////////   User CRUD

router.post("/adduser", auth, usercontroller.adduser); // signup
router.put("/updateuser", auth, usercontroller.updateuser);
router.get("/listuser", auth, usercontroller.listuser);
router.get("/viewuser", auth, usercontroller.viewuser);
router.delete("/deleteuser", auth, usercontroller.deleteuser);
router.post("/Login", usercontroller.Login);
router.put("/updateUserstatus", auth, usercontroller.updateUserstatus);

router.get("/viewuserprofile", auth, usercontroller.viewuserprofile);

///////////////////////////////   User roles CRUD

router.post("/setRole", auth, usercontroller.setRole);

module.exports = router;
