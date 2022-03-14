const { validationResult } = require("express-validator");
const Booking = require("../models/Booking");
const jwt = require("jsonwebtoken");
const Item = require("../models/Item");
const cloudinary = require("cloudinary").v2;
const { deleteFiles } = require("../../utils");
require("dotenv").config();

const cloud_name = process.env.cloud_name;
const api_key = process.env.api_key;
const api_secret = process.env.api_secret;

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

const index = async (req, res) => {
  try {
    const token = req.cookies.token;
    const user = jwt.decode(token);
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = {
      alertMessage,
      alertStatus,
    };
    const bookings = await Booking.find()
      .populate({ path: "item", select: "title" })
      .sort({ createdAt: "desc" })
      .select(
        "_id item bookingStartDate bookingEndDate name total status invoice createdAt"
      );
    return res.render("admin/booking", { user, alert, bookings });
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/booking");
  }
};

const show = async (req, res) => {
  try {
    const token = req.cookies.token;
    const user = jwt.decode(token);
    const { id } = req.params;
    const booking = await Booking.findById(id).populate("item");
    res.render("admin/booking/show", { user, booking });
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/booking");
  }
};

const confirmationBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;
    await Booking.findByIdAndUpdate(id, { status });
    req.flash("alertMessage", "Update Status Success");
    req.flash("alertStatus", "success");
    return res.redirect("/booking");
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    return res.redirect("/booking");
  }
};

const store = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      phoneNumber,
      bookingStartDate,
      bookingEndDate,
      item,
      bankFrom,
      duration,
      accountHolder,
    } = req.body;

    const errors = validationResult(req);
    const err = errors.array();

    if (!errors.isEmpty()) {
      if (req.file) {
        deleteFiles("public/images", req.file.filename);
      }
      return res
        .status(400)
        .json({ error: true, message: err.map((e) => `${e.msg}`) });
    }
    const itemBooking = await Item.findById(item);
    if (!itemBooking) {
      return res
        .status(404)
        .json({ error: true, message: "Item Booking Not found" });
    } else {
      const cloudImg = await cloudinary.uploader.upload(
        `public/images/${req.file.filename}`
      );
      if (cloudImg) {
        deleteFiles("public/images", req.file.filename);
      }
      const total = itemBooking.price * duration;
      const tax = (total * 10) / 100;
      const finalTotal = total + tax;
      const idInvoice = item.substring(item.length - 6);
      const booking = await Booking({
        name: `${firstname} ${lastname}`,
        email,
        phoneNumber,
        bookingStartDate,
        bookingEndDate,
        item,
        bankFrom,
        invoice: `B-${Math.floor(Math.random() * 10000000)}-${idInvoice}`,
        duration,
        accountHolder,
        total: finalTotal,
        proofPayment: cloudImg.secure_url,
      }).save();
      itemBooking.countBooking += 1;
      itemBooking.save();

      return res
        .status(201)
        .json({ message: "Booking Success", data: booking });
    }
  } catch (error) {
    if (req.file) {
      deleteFiles("public/images", req.file.filename);
    }
    return res.status(500).json({ error: true, message: error.message });
  }
};

module.exports = { index, show, store, confirmationBooking };
