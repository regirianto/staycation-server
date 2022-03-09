const express = require("express");
const { body } = require("express-validator");
const {
  index,
  store,
  create,
  destroy,
  show,
  addImage,
  deleteImage,
  edit,
  update,
} = require("../controllers/item");
const { uploadMultiple } = require("../middleware/multer");
const { createValidation } = require("../middleware/validations/item");
const router = express.Router();

router.get("/", index);
router.get("/create", create);
router.post("/", createValidation, store);
router.get("/:id", show);
router.post("/image-item/:id", uploadMultiple, addImage);
router.get("/edit/:id", edit);
router.put("/:id", createValidation, update);
router.delete("/image-item/:id/:idImg", deleteImage);
router.delete("/:id", destroy);

module.exports = router;
