const { body } = require("express-validator");
const { deleteFiles } = require("../../../utils");

const createBookingValidation = [
  body("email")
    .contains()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("is not the correct email format"),
  body("phoneNumber")
    .contains()
    .withMessage("Phone number is required")
    .isMobilePhone("id-ID")
    .withMessage("is not an Indonesian phone number format"),
  body("firstname").contains().withMessage("Firstname is required"),
  body("lastname").contains().withMessage("Lastname is required"),
  body("item").contains().withMessage("Item is required"),
  body("bookingStartDate")
    .isDate()
    .withMessage("Booking start date incorrect format date"),
  body("bookingEndDate")
    .isDate()
    .withMessage("Booking end date incorrect format date"),
  body("bankFrom").contains().withMessage("Bank from is required"),
  // body("duration")
  //   .isNumeric()
  //   .withMessage("Duration is required and must be number"),
  body("accountHolder").contains().withMessage("Account holder is required"),
  body("image").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Image proof payment must be uploaded");
    }
    if (req.file) {
      const extFile = ["image/jpeg", "image/jpg", "image/png"];

      if (req.file.size > 1000000) {
        deleteFiles("public/images", req.file.filename);
        throw new Error("Image Proof payment size max 1mb");
      }
      if (!extFile.includes(req.file.mimetype)) {
        deleteFiles("public/images", req.file.filename);
        throw new Error("Image must be JPG JEPG PNG");
      }
      return true;
    }
  }),
];

module.exports = createBookingValidation;
