const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Bank name Is Required"],
    },
    bankAccountNumber: {
      type: String,
      required: [true, "Bank account number is required"],
      unique: [true, "Bank account number is already exist"],
    },
    bankAccountName: {
      type: String,
      required: [true, "Bank account name is required"],
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bank", bankSchema);
