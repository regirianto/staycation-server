const express = require("express");
const { index, show, confirmationBooking } = require("../controllers/booking");
const router = express.Router();

router.get("/", index);
router.get("/:id", show);

router.put("/:id", confirmationBooking);

module.exports = router;
