const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "E-mail already Exist"],
  },
  phoneNumber: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Member", memberSchema);
