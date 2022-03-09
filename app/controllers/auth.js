const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const index = async (req, res) => {
  try {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = {
      alertMessage,
      alertStatus,
    };
    const token = req.cookies.token;
    if (token) {
      return res.redirect("/dashboard");
    }
    res.render("index", { alert });
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/");
  }
};

const singin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      req.flash("alertMessage", `${email} is Invalid !`);
      req.flash("alertStatus", "danger");
      return res.redirect("/");
    } else {
      const checkPassord = await bcrypt.compare(password, user.password);
      if (checkPassord) {
        const data = {
          id: user._id,
          email: user.email,
          isAdmin: user.isAdmin,
        };

        const token = await jwt.sign(data, process.env.JWT_KEY);

        res.cookie("token", token, {
          maxAge: 24 * 60 * 60 * 1000,
          httpOnly: true,
        });
        return res.redirect("/dashboard");
      } else {
        req.flash("alertMessage", `Your password is Invalid !`);
        req.flash("alertStatus", "danger");
        return res.redirect("/");
      }
    }
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/");
  }
};

const signout = (req, res) => {
  try {
    res.clearCookie("token");
    return res.redirect("/");
  } catch (error) {
    req.flash("alertMessage", error.message);
    req.flash("alertStatus", "danger");
    res.redirect("/");
  }
};

module.exports = { index, singin, signout };
