const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/CatchAsync");
const users = require("../controllers/users");
const passport = require("passport");

router.route("/register")
    .get(users.renderRegisterForm)
    .post(catchAsync(users.registerUser)); 

router.route("/login")
    .get(users.renderLoginForm)
    .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), users.login);

router.route("/logout").get(users.logout); 

module.exports = router; 