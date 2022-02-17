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

router.get("/", index);
router.get("/create", create);
router.post(
  "/",
  [check("name").contains().withMessage("Name Category is Required")],
  store
);
router.get("/:id/edit", edit);
router.put(
  "/:id",
  check("name").contains().withMessage("Name Category must Required"),
  update
);
router.delete("/:id", destroy);

module.exports = router;
