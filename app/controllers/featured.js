const Featured = require("../models/Featured");
const { deleteFiles } = require("../../utils");
const index = async (req, res) => {
  try {
    const features = await Featured.find();
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = {
      alertMessage,
      alertStatus,
    };
    res.render("admin/featured", { alert, features });
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/featured");
  }
};

const create = (req, res) => {
  try {
    res.render("admin/featured/create");
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/featured");
  }
};

const store = async (req, res) => {
  try {
    const { name, value } = req.body;
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
    res.render("admin/featured/edit", { featured });
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
    if (featured) {
      deleteFiles("public/images", featured.image);
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
