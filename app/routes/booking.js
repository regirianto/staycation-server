const express = require("express");
const { index } = require("../controllers/booking");
const router = express.Router();

router.get("/", index);

module.exports = router;
