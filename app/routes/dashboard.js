const express = require("express");
const { index, store } = require("../controllers/dashboard");
const router = express.Router();

router.get("/", index);

module.exports = router;
