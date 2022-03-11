const Featured = require("../models/Featured");
const { deleteFiles } = require("../../utils");
const Item = require("../models/Item");
const jwt = require("jsonwebtoken");
const index = async (req, res) => {
  try {
    const features = await Featured.find();
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = {
      alertMessage,
      alertStatus,
    };
    const token = req.cookies.token;
    const user = jwt.decode(token);
    res.render("admin/featured", { alert, features, user });
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/featured");
  }
};

const create = (req, res) => {
  try {
    const token = req.cookies.token;
    const user = jwt.decode(token);
    res.render("admin/featured/create", { user });
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/featured");
  }
};

const store = async (req, res) => {
  try {
    const { name } = req.body;
    const featured = await Featured({
      name,
      image: req.file.filename,
    }).save();

    if (featured) {
      req.flash("alertMessage", "Add Featured Success");
      req.flash("alertStatus", "success");
      res.redirect("/featured");
    }
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/featured");
  }
};

const edit = async (req, res) => {
  try {
    const featured = await Featured.findById(req.params.id);
    const token = req.cookies.token;
    const user = jwt.decode(token);
    res.render("admin/featured/edit", { featured, user });
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/featured");
  }
};

const update = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const featured = await Featured.findById(id);
    if (!req.file) {
      await Featured.findByIdAndUpdate(id, {
        $set: { name, image: featured.image },
      });
    } else {
      await Featured.findByIdAndUpdate(id, {
        $set: { name, image: req.file.filename },
      });
      deleteFiles("public/images", featured.image);
    }
    req.flash("alertMessage", "Update Featured Success");
    req.flash("alertStatus", "success");
    res.redirect("/featured");
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/featured");
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const featured = await Featured.findByIdAndRemove(id);
    const items = await Item.find({ featured: id });
    if (featured) {
      deleteFiles("public/images", featured.image);
      items.map(async (item) => {
        let newFeatureditem = item.featured.filter(
          (itemFeatured) => itemFeatured != id
        );
        item.featured = newFeatureditem;
        await item.save();
      });
      req.flash("alertMessage", "Update Featured Success");
      req.flash("alertStatus", "success");
      res.redirect("/featured");
    }
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/featured");
  }
};

module.exports = { index, create, store, edit, update, destroy };
