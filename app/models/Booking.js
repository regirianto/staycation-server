const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingStartDate: {
      type: Date,
      required: [true, "Booking Start Date is Required"],
    },
    bookingEndDate: {
      type: Date,
      required: [true, "Booking Start Date is Required"],
    },
    item: {
      type: mongoose.SchemaType.ObjectId,
      ref: "Item",
    },
    member: {
      type: mongoose.SchemaType.ObjectId,
      ref: "Member",
    },
    bankFrom: {
      type: String,
      required: [true, "Booking bank from is required"],
    },
    night: {
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
