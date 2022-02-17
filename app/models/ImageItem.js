const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: [true, "Image is required"],
  },
  item: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Item",
  },
});

module.exports = mongoose.model("ImageItem", imageSchema);
