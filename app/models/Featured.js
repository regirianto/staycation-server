const mongoose = require("mongoose");

const featuredSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Featured name is required"],
    },
    value: {
      type: String,
    },
    image: {
      type: String,
      required: [true, "Featured image is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Featured", featuredSchema);
