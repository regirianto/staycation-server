const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const Bank = require("../models/Bank");
const { index, create, store } = require("../controllers/bank");

router.get("/", index);
router.get("/create", create);
router.post(
  "/",
  [
    body("name").contains().withMessage("Name Bank is Required"),
    body("bankAccountName")
      .contains()
      .withMessage("Bank Account Holder is Required"),
    body("bankAccountNumber")
      .contains()
      .withMessage("Bank Account Number is Required"),
    body("bankAccountNumber")
      .isNumeric()
      .withMessage("Bank Account Number Must be Numeric"),
    body("bankAccountNumber").custom(async (value) => {
      const banks = await Bank.find();
      const duplicate = banks.find((bank) => bank.bankAccountNumber == value);
      if (duplicate) {
        throw new Error("Bank Account Number Already Exists");
      }
    }),
  ],
  store
);

module.exports = router;
