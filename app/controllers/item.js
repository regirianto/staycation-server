const index = (req, res) => {
  try {
    res.render("admin/item");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { index };
