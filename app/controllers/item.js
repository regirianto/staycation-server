const { validationResult } = require("express-validator");
const Category = require("../models/Category");
const Item = require("../models/Item");
const Featured = require("../models/Featured");
const ImageItem = require("../models/ImageItem");
const { deleteFiles } = require("../../utils");
const jwt = require("jsonwebtoken");
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
    const token = req.cookies.token;
    const user = jwt.decode(token);
    res.render("admin/item", { alert, items, user });
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
    const token = req.cookies.token;
    const user = jwt.decode(token);
    res.render("admin/item/create", { categories, features, user });
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
    const features = await Featured.find().select("_id name image");
    const errors = validationResult(req);
    const token = req.cookies.token;
    const user = jwt.decode(token);
    if (!errors.isEmpty())
      return res.render("admin/item/create", {
        categories,
        title,
        price,
        city,
        category,
        desc,
        country,
        features,
        user,
        errors: errors.array(),
      });

    const item = await Item({
      title,
      city,
      category,
      country,
      desc,
      price,
      featured,
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

const edit = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    const categories = await Category.find();
    const features = await Featured.find();
    const token = req.cookies.token;
    const user = jwt.decode(token);
    res.render("admin/item/edit", { item, categories, features, user });
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/item");
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, city, category, desc, country, featured } = req.body;
    const oldItem = await Item.findById(id);
    const item = await Item.findById(id);
    const oldCategory = await Category.findById(oldItem.category);
    const newCategory = await Category.findById(category);
    const categories = await Category.find();
    const features = await Featured.find();
    const errors = validationResult(req);
    const token = req.cookies.token;
    const user = jwt.decode(token);
    if (!errors.isEmpty())
      return res.render("admin/item/edit", {
        categories,
        title,
        price,
        city,
        category,
        desc,
        country,
        features,
        item,
        user,
        errors: errors.array(),
      });
    else {
      await Item.findByIdAndUpdate(id, {
        $set: { title, price, city, category, desc, country, featured },
      });
      if (oldItem.category != category) {
        const newFilteredCategory = oldCategory.items.filter(
          (idItem) => idItem != id
        );
        oldCategory.items = newFilteredCategory;
        oldCategory.save();
        newCategory.items.push(id);
        newCategory.save();
      }

      req.flash("alertMessage", "Update Item Success");
      req.flash("alertStatus", "success");
      res.redirect(`/item/${id}`);
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
    const itemsImage = await ImageItem.find({ item: id });
    const deletedItem = await Item.findByIdAndRemove(id);

    if (deletedItem) {
      const newCategoryItems = category.items.filter((item) => item != id);
      category.items = newCategoryItems;
      category.save();
      itemsImage.forEach((e) => {
        deleteFiles("public/images", e.imageUrl);
      });
      await ImageItem.deleteMany({ item: id });
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

const show = async (req, res) => {
  try {
    const { id } = req.params;
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = {
      alertMessage,
      alertStatus,
    };
    const token = req.cookies.token;
    const user = jwt.decode(token);
    let item = await Item.findById(id)
      .populate({
        path: "category",
        select: "_id name",
      })
      .populate({ path: "featured", select: "name image" })
      .populate({ path: "image", select: "_id imageUrl" });
    res.render("admin/item/show", { item, alert, user });
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/item");
  }
};

const addImage = async (req, res) => {
  try {
    const { id } = req.params;
    const Items = await Item.findById(id);
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        if (req.files[i].size > 2000000) {
          for (let j = 0; j < req.files.length; j++) {
            deleteFiles("public/images", req.files[j].filename);
          }
          throw new Error("Image Item max size 2000000");
        }
        let imageItem = await ImageItem({
          imageUrl: req.files[i].filename,
          item: id,
        }).save();
        if (imageItem) {
          Items.image.push(imageItem._id);
        }
      }
      Items.save();
    }
    req.flash("alertMessage", "Add Image Item Success");
    req.flash("alertStatus", "success");
    return res.redirect(`/item/${id}`);
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    return res.redirect("/item");
  }
};

const deleteImage = async (req, res) => {
  try {
    const { id, idImg } = req.params;
    const deleteImage = await ImageItem.findByIdAndRemove(idImg);
    const item = await Item.findById(id);
    if (deleteImage) {
      const newimg = item.image.filter((img) => img != idImg);
      item.image = newimg;
      item.save();
      deleteFiles("public/images", deleteImage.imageUrl);
      req.flash("alertMessage", "Delete Image Item Success");
      req.flash("alertStatus", "success");
      res.redirect(`/item/${id}`);
    }
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect(`/item`);
  }
};

module.exports = {
  index,
  create,
  store,
  destroy,
  show,
  addImage,
  deleteImage,
  edit,
  update,
};
