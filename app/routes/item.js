const express = require("express");
const { body } = require("express-validator");
const { index, store, create, destroy } = require("../controllers/item");
const { uploadMultiple } = require("../middleware/multer");
const { createValidation } = require("../middleware/validations/item");
const router = express.Router();

router.get("/", index);
router.get("/create", create);
router.post("/", uploadMultiple, createValidation, store);
router.delete("/:id", destroy);

module.exports = router;
