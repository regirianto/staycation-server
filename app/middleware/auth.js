const jwt = require("jsonwebtoken");
require("dotenv").config();
const isLogin = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.flash("alertMessage", "Please Login");
    req.flash("alertStatus", "danger");
    return res.redirect("/");
  }
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_KEY);
      return next();
    } catch (error) {
      res.clearCookie("token");
      return res.redirect("/");
    }
  }
};

module.exports = isLogin;
