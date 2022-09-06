const User = require("../models/User");

const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const salt = 12;

exports.getLogin = (req, res) => {
  console.log("Get Login");
  const { password, username } = req.body;
  res.render("auth/login.hbs"), { title: "Login Page", password, username };
};
exports.postLogin = asyncHandler(async (req, res) => {
  console.log("Post Login");

  const { password, username } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("auth/login.hbs", {
      title: "Login Page",
      errorMessage: errors.array()[0].msg,
    });
  }

  const user = await User.findOne({ username: username });

  if (!user) {
    req.flash("error", "Invalid username or password");
    return res.redirect("/login");
  }

  const match = await await bcrypt.compare(password, user.password);

  if (!match) {
    req.flash("erro", "Invalid username or password");
    return res.redirect("/login");
  }
  req.session.isLoggedIn = true;
  req.session.user = user;
  await req.session.save();
  req.flash("success", "Logged In successfully !");
  return res.redirect("/");
});

exports.getRegister = asyncHandler(async (req, res) => {
  console.log("Get Register");
  res.render("auth/register.hbs"), { title: "Register Page" };
});

exports.postRegister = asyncHandler(async (req, res) => {
  console.log("Post Register");
  const { username, password, password2 } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("auth/register.hbs", {
      title: "Register Page",
      errorMessage: errors.array()[0].msg,
      password,
      username,
      password2,
    });
  }

  const hash = await bcrypt.hash(password, salt);

  const user = new User({ password, username });

  await user.save();
  req.flash("success", "User created successfully");
  res.redirect("/login");
});
exports.getLogout = asyncHandler(async (req, res) => {
  console.log("Get Logout");
  await req.session.destroy();
  res.redirect("/");
});
