const express = require("express");
const router = express.Router();
const {
  getLogin,
  getRegister,
  postLogin,
  postRegister,
  getLogout,
} = require("../controllers/authCtrl");

const {
  loginValidation,
  registerValidation,
} = require("../validation/authValidate");

router.get("/login", getLogin);
router.post("/login", loginValidation(), postLogin);
router.get("/register", getRegister);
router.post("/register", registerValidation(), postRegister);
router.get("/logout", getLogout);

module.exports = router;
