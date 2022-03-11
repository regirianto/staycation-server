const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    bookingStartDate: {
      type: Date,
      required: [true, "Booking Start Date is Required"],
    },
    bookingEndDate: {
      type: Date,
      required: [true, "Booking Start Date is Required"],
    },
    item: {
      required: true,
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Item",
    },

    bankFrom: {
      type: String,
      required: [true, "Booking bank from is required"],
    },
    duration: {
      type: Number,
      required: [true, "Booking per night is required"],
    },
    proofPayment: {
      type: String,
      required: [true, "Payment proof is required"],
    },
    accountHolder: {
      type: String,
      required: [true, "Account holder is required"],
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    total: {
      type: String,
      required: true,
    },
    invoice: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
