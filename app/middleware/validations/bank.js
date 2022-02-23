const { body } = require("express-validator");
const Bank = require("../../models/Bank");
const { deleteFiles } = require("../../../utils");

const validationCreate = [
  body("name").contains().withMessage("Name Bank is Required"),
  body("bankAccountName")
    .contains()
    .withMessage("Bank Account Holder is Required"),
  body("bankAccountNumber")
    .contains()
    .withMessage("Bank Account Number is Required")
    .isNumeric()
    .withMessage("Bank Account Number Must be Numeric"),
  body("image").custom((value, { req }) => {
    const extensionFile = req.file?.mimetype.toLowerCase();
    if (typeof req.file == "undefined") {
      throw new Error(
        "Image is required and file must be an image and size max 1mb"
      );
    }
    if (req.file) {
      if (req.file.size > 1000000) {
        deleteFiles("public/images", req.file.filename);
        throw new Error("Size bank image max 1mb");
      }
      if (
        extensionFile == "image/jpeg" ||
        extensionFile == "image/jpg" ||
        extensionFile == "image/png"
      ) {
        return true;
      } else {
        deleteFiles("public/images", req.file.filename);
        throw new Error("Image must be JPG PNG JPEG");
      }
    }
  }),
  body("bankAccountNumber").custom(async (value) => {
    const banks = await Bank.find();
    const duplicate = banks.find((bank) => bank.bankAccountNumber == value);
    if (duplicate) {
      throw new Error("Bank Account Number Already Exists");
    }
  }),
];

const validationUpdate = [
  body("name").contains().withMessage("Name Bank is Required"),
  body("bankAccountName")
    .contains()
    .withMessage("Bank Account Holder is Required"),
  body("bankAccountNumber")
    .contains()
    .withMessage("Bank Account Number is Required")
    .isNumeric()
    .withMessage("Bank Account Number Must be Numeric"),
  body("image").custom((value, { req }) => {
    const extensionFile = req.file?.mimetype.toLowerCase();
    if (req.file) {
      if (req.file.size > 1000000) {
        deleteFiles("public/images", req.file.filename);
        throw new Error("Size bank image max 1mb");
      }
      if (
        extensionFile == "image/jpeg" ||
        extensionFile == "image/jpg" ||
        extensionFile == "image/png"
      ) {
        return true;
      } else {
        deleteFiles("public/images", req.file.filename);
        throw new Error("Image must be JPG PNG JPEG");
      }
    }
    return true;
  }),
  body("bankAccountNumber").custom(async (value, { req }) => {
    const oldBank = await Bank.findById(req.params.id);
    const banks = await Bank.find();
    const duplicate = banks.find((bank) => bank.bankAccountNumber == value);

    if (duplicate) {
      if (oldBank.bankAccountNumber === value) {
        return true;
      }
      throw new Error("Bank Account Number Already Exists");
    }
  }),
];

module.exports = { validationCreate, validationUpdate };
