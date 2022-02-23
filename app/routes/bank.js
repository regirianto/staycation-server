const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { uploadSingle } = require("../middleware/multer");
const {
  validationCreate,
  validationUpdate,
} = require("../middleware/validations/bank");
const {
  index,
  create,
  store,
  destroy,
  edit,
  update,
} = require("../controllers/bank");

router.get("/", index);
router.get("/create", create);
router.get("/:id", edit);
router.delete("/:id", destroy);
router.post("/", uploadSingle, validationCreate, store);
router.put("/:id", uploadSingle, validationUpdate, update);
module.exports = router;
