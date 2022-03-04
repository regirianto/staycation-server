const { body } = require("express-validator");
const { deleteFiles } = require("../../../utils");

const createValidation = [
  body("title").contains().withMessage("Field title is required"),
  body("price")
    .contains()
    .withMessage("Field price is required")
    .isNumeric()
    .withMessage("Field price must be a number"),
  body("country").contains().withMessage("Field country is required"),
  body("city").contains().withMessage("Field city is required"),
  body("category").contains().withMessage("Field category is required"),
  body("featured").contains().withMessage("Field featured is required"),
  body("desc")
    .contains()
    .withMessage("Field desc is required")
    .isLength({ min: 50 })
    .withMessage("Field desc min 50 word"),
  body("image").custom((value, { req }) => {
    if (req.files.length == 0) {
      throw new Error(
        "Image is required and files must be an image and size max 2mb"
      );
    }
    if (req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        if (req.files[i].size > 2000000) {
          for (let j = 0; j < req.files.length; j++) {
            deleteFiles("public/images", req.files[j].filename);
          }
          throw new Error("Size item image max 2mb");
        }
        if (
          req.files[i].mimetype === "image/jpeg" ||
          req.files[i].mimetype === "image/jpg" ||
          req.files[i].mimetype === "image/png"
        ) {
          return true;
        } else {
          for (let j = 0; j < req.files.length; j++) {
            deleteFiles("public/images", req.files[j].filename);
          }
          throw new Error("image must JPG PNG JPEG");
        }
      }
    }
  }),
];

module.exports = { createValidation };
