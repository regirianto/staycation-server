const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name category must be required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
