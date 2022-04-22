const Item = require("../models/Item");
const Booking = require("../models/Booking");
const jwt = require("jsonwebtoken");
const index = async (req, res) => {
  try {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = {
      alertMessage,
      alertStatus,
    };
    const token = req.cookies.token;
    const user = jwt.decode(token);
    const items = await Item.find().count();
    const bookings = await Booking.find().count();

    res.render("admin/dashboard", { alert, user, items, bookings });
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/dashboard");
  }
};

module.exports = { index };
