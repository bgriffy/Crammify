const Workspace = (require("../models/workspace"));
const Review = require("../models/review");

module.exports.createReview = async (req, res, next) => {
    const { id } = req.params;
    const workspace = await Workspace.findById(id);
    const newReview = new Review(req.body.review);

    newReview.author = req.user._id;
    newReview.workspace = workspace;
    workspace.reviews.push(newReview);

    await newReview.save();
    await workspace.save();

    req.flash("success", "Your review has been added successfully.");
    res.redirect(`/workspaces/${id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { workspaceID, reviewID } = req.params;
    await Workspace.findByIdAndUpdate(workspaceID, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    req.flash("success", "Review has been successfully deleted.");
    res.redirect(`/workspaces/${workspaceID}`);
};