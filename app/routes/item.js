const express = require("express");
const { index } = require("../controllers/item");
const router = express.Router();

router.get("/", index);

module.exports = router;
