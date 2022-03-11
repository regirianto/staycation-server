const Category = require("../models/Category");
const Item = require("../models/Item");
const Bank = require("../models/Bank");

const landingPage = async (req, res, next) => {
  try {
    const mostPicked = await Item.find()
      .populate({ path: "image", select: "_id imageUrl" })
      .limit(5)
      .select("_id title image city country");
    const categories = await Category.find()
      .populate({
        path: "items",
        select: "_id title image city country",
        populate: { path: "image", select: "_id imageUrl", limit: 1 },
      })
      .select("_id items name");
    const data = {
      mostPicked,
      categories,
    };
    return res.status(200).json({ message: "success", data });
  } catch (err) {
    return res.status(500).json({ message: err.message, error: true });
  }
};

const detailItemPage = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id)
      .populate({ path: "category", select: "_id name" })
      .populate({ path: "featured", select: "_id name image" })
      .populate({ path: "image", select: "_id imageUrl" })
      .select("_id title category price country city desc featured image");
    const data = { item };
    res.status(200).json({ message: "success", data });
  } catch (error) {
    return res.status(500).json({ message: err.message, error: true });
  }
};

const bankPaymentMenthode = async (req, res) => {
  try {
    const bank = await Bank.find().select(
      "_id name bankAccountNumber bankAccountName image"
    );
    res.status(200).json({ data: bank });
  } catch (error) {
    return res.status(500).json({ message: err.message, error: true });
  }
};

module.exports = { landingPage, detailItemPage, bankPaymentMenthode };
