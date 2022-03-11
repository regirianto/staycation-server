const { body } = require("express-validator");

const createCategoryValidation = [
  body("name").contains().withMessage("Category is required"),
];

module.exports = { createCategoryValidation };
