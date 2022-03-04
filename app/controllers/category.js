const { validationResult } = require("express-validator");
const Category = require("../models/Category");
const Item = require("../models/Item");

const index = async (req, res) => {
  try {
    const categories = await Category.find().select("_id name");
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = {
      alertMessage,
      alertStatus,
    };

    res.render("admin/category", {
      categories,
      alert,
    });
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/category");
  }
};

const create = (req, res) => {
  try {
    res.render("admin/category/create");
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/category");
  }
};

const store = async (req, res) => {
  try {
    const { name } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("admin/category/create", {
        errors: errors.array(),
        name,
      });
    } else {
      await Category({ name })
        .save()
        .then((result) => {
          req.flash("alertMessage", "Add Category Success");
          req.flash("alertStatus", "success");
          res.redirect("/category");
        });
    }
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/category");
  }
};

const edit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const categorie = await Category.findById(id).select("name _id");
    res.render("admin/category/edit", { categorie, name });
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/category");
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const errors = validationResult(req);
    const categorie = await Category.findById(id);
    if (!errors.isEmpty()) {
      return res.render("admin/category/edit", {
        errors: errors.array(),
        categorie,
      });
    } else {
      await Category.findByIdAndUpdate(id, { $set: { name: name } });
      req.flash("alertMessage", "Update Category Success");
      req.flash("alertStatus", "success");
      res.redirect("/category");
    }
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndRemove(id);
    if (category) {
      category.items.forEach(async (item) => {
        await Item.findByIdAndRemove(item);
      });
      req.flash("alertMessage", "Delete Category Success");
      req.flash("alertStatus", "success");
      res.redirect("/category");
    }
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
  }
};

module.exports = { index, create, store, edit, update, destroy };
