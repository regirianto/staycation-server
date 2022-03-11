const express = require("express");
const { body } = require("express-validator");
const {
  landingPage,
  detailItemPage,
  bankPaymentMenthode,
} = require("../controllers/api");
const { store } = require("../controllers/booking");
const { uploadSingle } = require("../middleware/multer");
const router = express.Router();

router.post(
  "/booking",
  uploadSingle,
  [
    body("email").isEmail().withMessage("is not the correct email format"),
    body("phoneNumber")
      .isMobilePhone("id-ID")
      .withMessage("is not an Indonesian phone number format"),
  ],
  store
);

router.get("/landingpage", landingPage);
router.get("/item/:id", detailItemPage);
router.get("/bank", bankPaymentMenthode);

module.exports = router;
