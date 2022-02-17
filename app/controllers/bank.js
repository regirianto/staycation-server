const { validationResult } = require("express-validator");
const Bank = require("../models/Bank");

const index = async (req, res) => {
  const banks = await Bank.find();
  try {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = {
      alertMessage,
      alertStatus,
    };
    res.render("admin/bank", { banks, alert });
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/bank");
  }
};

const create = (req, res) => {
  try {
    res.render("admin/bank/create");
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/bank");
  }
};

const store = async (req, res) => {
  try {
    const { name, bankAccountName, bankAccountNumber } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("admin/bank/create", {
        errors: errors.array(),
        bankAccountName,
        name,
        bankAccountNumber,
      });
    } else {
      await Bank({ bankAccountName, name, bankAccountNumber })
        .save()
        .then((result) => {
          req.flash("alertMessage", "Add Bank Success");
          req.flash("alertStatus", "success");
          res.redirect("/bank");
        })
        .catch((err) => console.log(err));
    }
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/bank");
  }
};

module.exports = { index, create, store };
