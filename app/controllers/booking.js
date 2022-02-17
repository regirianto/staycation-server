const index = (req, res) => {
  try {
    res.render("admin/booking");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { index };
