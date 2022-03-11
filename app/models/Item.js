const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title item is required"],
    },
    price: {
      type: Number,
      default: 0,
      required: [true, "Price item is required"],
    },
    country: {
      type: String,
      default: "Indonesia",
      required: [true, "Country item is required"],
    },
    city: {
      type: String,
      required: [true, "City item is required"],
    },
    desc: {
      type: String,
      required: [true, "Descriptions item is required"],
    },

    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Category",
      required: [true, "Category Is required"],
    },
    countBooking: {
      type: Number,
      default: 0,
    },
    featured: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Featured",
      },
    ],
    image: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "ImageItem",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
