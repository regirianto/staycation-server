const index = (req, res) => {
  try {
    const token = req.cookies.token;
    const user = jwt.decode(token);
    res.render("admin/booking", { user });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { index };
