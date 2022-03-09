const { body } = require("express-validator");

const createValidation = [
  body("title").contains().withMessage("Field title is required"),
  body("price")
    .contains()
    .withMessage("Field price is required")
    .isNumeric()
    .withMessage("Field price must be a number"),
  body("country").contains().withMessage("Field country is required"),
  body("city").contains().withMessage("Field city is required"),
  body("category").contains().withMessage("Field category is required"),
  body("featured").contains().withMessage("Field featured is required"),
  body("desc")
    .contains()
    .withMessage("Field desc is required")
    .isLength({ min: 50 })
    .withMessage("Field desc min 50 word"),
];

module.exports = { createValidation };
