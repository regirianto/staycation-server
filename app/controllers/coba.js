require("dotenv").config();
const Category = require("../models/Category");
const { validationResult } = require("express-validator");

const getCoba = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const categorie = await Category.create({
    name: req.body.name,
  });
  if (categorie) {
    console.log(req.body);
    return res.status(201).json({
      message: "Succes",
      data: categorie.name,
    });
  } else {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
};

const tesCoba = async (req, res) => {
  const categories = await Category.find();
  if (categories) {
    res.send(categories);
  }
};

module.exports = { getCoba, tesCoba };
