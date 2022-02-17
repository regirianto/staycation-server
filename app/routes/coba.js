const express = require("express");
const router = express.Router();
const { body, check } = require("express-validator");
const { getCoba, tesCoba } = require("../controllers/coba");

router.post(
  "/",
  check("name", "Name Category must be required").contains(),
  getCoba
);
router.get("/tes", tesCoba);
module.exports = router;
