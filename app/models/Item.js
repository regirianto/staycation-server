const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title item is required"],
    },
    price: {
      type: Number,
      required: [true, "Price item is required"],
    },
    country: {
      type: String,
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
    image: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Image",
      },
    ],
    category: { type: mongoose.SchemaTypes.ObjectId, ref: "Category" },
    featured: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Featured",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
