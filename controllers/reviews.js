const Workspace = (require("../models/workspace"));
const Review = require("../models/review");

module.exports.createReview = async (req, res, next) => {
    const { id } = req.params;
    const { review } = req.body;
    const workspace = await Workspace.findById(id);
    const newReview = new Review(review);

    newReview.author = req.user._id;
    newReview.workspace = workspace;
    workspace.reviews.push(newReview);

    await newReview.save();
    await workspace.save();

    req.flash("success", "Your review has been added successfully.");
    res.redirect(`/workspaces/${id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewID } = req.params;
    await Workspace.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    req.flash("success", "Review has been successfully deleted.");
    res.redirect(`/workspaces/${id}`);
};