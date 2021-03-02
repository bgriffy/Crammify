const { workspaceValidationSchema, reviewValidationSchema } = require("./validationSchemas.js");
const ExpressError = require("./utils/ExpressError");
const Workspace = (require("./models/workspace"));
const Review = (require("./models/review"));

module.exports.isLoggedIn = (req, res, next) => {
    console.log("Req.User:" + req.user);
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in to perform this action.");
        return res.redirect("/login");
    }
    next();
}

module.exports.validateWorkspace = (req, res, next) => {
    const { error } = workspaceValidationSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    }
    else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const workspace = await Workspace.findById(id);
    if (!workspace.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission!!! Begone HACKER!!!!!");
        return res.redirect(`/workspaces/${workspace._id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewValidationSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    }
    else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewID } = req.params;
    const review = await Review.findById(reviewID);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission!!! Begone HACKER!!!!!");
        return res.redirect(`/workspaces/${id}`);
    }
    next();
}