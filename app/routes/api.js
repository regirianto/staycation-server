const express = require("express");
const {
  landingPage,
  detailItemPage,
  bankPaymentMenthode,
} = require("../controllers/api");

const { store } = require("../controllers/booking");
const { uploadSingle } = require("../middleware/multer");
const createBookingValidation = require("../middleware/validations/booking");
const router = express.Router();

router.post("/booking", uploadSingle, createBookingValidation, store);

router.get("/landing-page", landingPage);
router.get("/item/:id", detailItemPage);
router.get("/bank", bankPaymentMenthode);

module.exports = router;
