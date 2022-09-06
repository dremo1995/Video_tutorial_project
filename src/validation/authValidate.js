const { body } = require("express-validator");
const User = require("../models/User");

exports.loginValidation = (req, res) => {
  return [
    body("username")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please provide username")
      .isAlphanumeric()
      .withMessage("Username should be Alphanumeric")
      .isLength({ min: 5 })
      .withMessage("Username should be atleast 5 chracters"),
    body("password")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please provide password")
      .isAlphanumeric()
      .withMessage("Password should be Alphanumeric")
      .isLength({ min: 5 })
      .withMessage("Password should be atleast 5 characters"),
  ];
};

exports.registerValidation = (req, res) => {
  return [
    body("username")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please provide username")
      .isAlphanumeric()
      .withMessage("Username should be Alphanumeric")
      .isLength({ min: 5 })
      .withMessage("Username should be atleast 5 characters")
      .custom((value) => {
        return User.findOne({ username: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Username is taken");
          }
        });
      }),

    body("password")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please provide password")
      .isAlphanumeric()
      .withMessage("Password should be Alphanumeric")
      .isLength({ min: 5 })
      .withMessage("Password should be atleast 5 characters"),

    body("repeatPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password Not matching");
      } else {
        return true;
      }
    }),
  ];
};
