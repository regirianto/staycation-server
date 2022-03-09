const express = require("express");
const router = express.Router();
const { index, singin, signout } = require("../controllers/auth");

router.get("/", index);
router.get("/signout", signout);
router.post("/signin", singin);

module.exports = router;
