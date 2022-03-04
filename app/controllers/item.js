const { validationResult } = require("express-validator");
const Category = require("../models/Category");
const Item = require("../models/Item");
const Featured = require("../models/Featured");

const index = async (req, res) => {
  try {
    const items = await Item.find()
      .populate({
        path: "category",
        select: "_id name",
      })
      .select("title price city country");

    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = {
      alertMessage,
      alertStatus,
    };

    res.render("admin/item", { alert, items });
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/item");
  }
};

const create = async (req, res) => {
  try {
    const categories = await Category.find();
    const features = await Featured.find().select("_id name image");
    res.render("admin/item/create", { categories, features });
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/item");
  }
};

const store = async (req, res) => {
  try {
    const categories = await Category.find();
    const { title, price, city, category, desc, country, featured } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.render("admin/item/create", {
        categories,
        title,
        price,
        city,
        category,
        desc,
        country,
        errors: errors.array(),
      });
    const imageItem = [];
    if (!errors.isEmpty()) {
      return res.render("admin/item/add-item", {});
    }
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        imageItem.push(req.files[i].filename);
      }
    }
    const item = await Item({
      title,
      city,
      category,
      country,
      desc,
      price,
      featured,
      image: imageItem,
    }).save();
    if (item) {
      const categoryId = await Category.findById(item.category);
      const itemID = item._id;
      categoryId.items.push(itemID);
      categoryId.save();
      req.flash("alertMessage", "Add Item Success");
      req.flash("alertStatus", "success");
      res.redirect("/item");
    }
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/item");
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const oldItem = await Item.findById(id);
    const category = await Category.findById(oldItem.category);

    const deletedItem = await Item.findByIdAndRemove(id);

    if (deletedItem) {
      const newCategoryItems = category.items.filter((item) => item != id);
      category.items = newCategoryItems;
      category.save();
      req.flash("alertMessage", "Delete Item Success");
      req.flash("alertStatus", "success");
      res.redirect("/item");
    }
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/item");
  }
};

module.exports = { index, create, store, destroy };
