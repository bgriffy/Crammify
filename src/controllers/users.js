const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
    res.render("users/register");
};

module.exports.registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to Crammify!");
            res.redirect("/workspaces");
        })
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/register");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
};

module.exports.login = (req, res) => {
    req.flash("success", "You have successfully logged in!");
    const redirectUrl = req.session.returnTo || "/workspaces"
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout();
    req.flash("success", "Goodbye! Please come again! I'm nothing without you!!");
    res.redirect("/workspaces");
};