const express = require("express");
const {
  index,
  create,
  store,
  edit,
  update,
  destroy,
} = require("../controllers/featured");
const { uploadSingle } = require("../middleware/multer");
const router = express.Router();

router.get("/", index);
router.get("/create", create);
router.post("/", uploadSingle, store);
router.get("/edit/:id", edit);
router.put("/:id", uploadSingle, update);
router.delete("/:id", destroy);

module.exports = router;
