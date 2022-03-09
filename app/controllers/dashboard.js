const jwt = require("jsonwebtoken");
const index = (req, res) => {
  try {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = {
      alertMessage,
      alertStatus,
    };
    const token = req.cookies.token;
    const user = jwt.decode(token);
    res.render("admin/dashboard", { alert, user });
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/dashboard");
  }
};

module.exports = { index };
