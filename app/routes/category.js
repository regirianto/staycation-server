const express = require("express");
const router = express.Router();
const { body, check } = require("express-validator");
const {
  index,
  create,
  store,
  edit,
  update,
  destroy,
} = require("../controllers/category");
const {
  createCategoryValidation,
} = require("../middleware/validations/category");

router.get("/", index);
router.get("/create", create);
router.post("/", createCategoryValidation, store);
router.get("/:id/edit", edit);
router.put("/:id", createCategoryValidation, update);
router.delete("/:id", destroy);

module.exports = router;
