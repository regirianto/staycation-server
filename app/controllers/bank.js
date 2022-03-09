const { validationResult } = require("express-validator");
const Bank = require("../models/Bank");
const { deleteFiles } = require("../../utils");
const jwt = require("jsonwebtoken");

const index = async (req, res) => {
  const banks = await Bank.find();
  try {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = {
      alertMessage,
      alertStatus,
    };
    const token = req.cookies.token;
    const user = jwt.decode(token);
    res.render("admin/bank", { banks, alert, user });
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/bank");
  }
};

const create = (req, res) => {
  try {
    const token = req.cookies.token;
    const user = jwt.decode(token);
    res.render("admin/bank/create", { user });
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/bank");
  }
};

const store = async (req, res) => {
  try {
    const token = req.cookies.token;
    const user = jwt.decode(token);
    const { name, bankAccountName, bankAccountNumber } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("admin/bank/create", {
        errors: errors.array(),
        bankAccountName,
        name,
        bankAccountNumber,
        user,
      });
    } else {
      await Bank({
        bankAccountName,
        name,
        bankAccountNumber,
        image: req.file.filename,
      })
        .save()
        .then((result) => {
          req.flash("alertMessage", "Add Bank Success");
          req.flash("alertStatus", "success");
          res.redirect("/bank");
        });
    }
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/bank");
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const bank = await Bank.findByIdAndRemove(id);
    deleteFiles("public/images", bank.image);
    if (bank) {
      req.flash("alertMessage", "Delete Bank Success");
      req.flash("alertStatus", "success");
      res.redirect("/bank");
    }
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/bank");
  }
};

const edit = async (req, res) => {
  try {
    const { id } = req.params;
    const bank = await Bank.findById(id);
    const token = req.cookies.token;
    const user = jwt.decode(token);
    res.render("admin/bank/edit", { bank, user });
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/bank");
  }
};

const update = async (req, res) => {
  try {
    const { name, bankAccountName, bankAccountNumber } = req.body;
    const { id } = req.params;
    const token = req.cookies.token;
    const user = jwt.decode(token);
    const errors = validationResult(req);
    const bank = await Bank.findById(id);
    if (!errors.isEmpty()) {
      return res.render("admin/bank/edit", {
        errors: errors.array(),
        bankAccountName,
        name,
        bankAccountNumber,
        bank,
        user,
      });
    }

    if (!req.file) {
      await Bank.findByIdAndUpdate(id, {
        $set: { name, bankAccountName, bankAccountNumber, image: bank.image },
      });
      req.flash("alertMessage", "Update Bank Success");
      req.flash("alertStatus", "success");
      res.redirect("/bank");
    } else {
      await Bank.findByIdAndUpdate(id, {
        $set: {
          name,
          bankAccountName,
          bankAccountNumber,
          image: req.file.filename,
        },
      });
      deleteFiles("public/images", bank.image);
      req.flash("alertMessage", "Update Bank Success");
      req.flash("alertStatus", "success");
      res.redirect("/bank");
    }
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/bank");
  }
};

module.exports = { index, create, store, edit, update, destroy };
