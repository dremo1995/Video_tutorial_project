const { body } = require("express-validator");
const Course = require("../models/Course");

exports.courseValidation = (req, res) => {
  return [
    body("title")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please provide a title")
      .isLength({ min: 4 })
      .withMessage("Title should be atleast 4 characters"),

    body("description")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please provide a title")
      .isLength({ min: 20 })
      .withMessage("Description should be atleast 20 characters"),
    body("imageUrl")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please provide a Image URL")
      .isURL({ protocols: ["https", "http"] })
      .withMessage("Image URL should begin with https or http"),
  ];
};
