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

    // Get the array of review IDs associated with the workspace
    Workspace.findOne(id, 'reviews', (err, workspace) => {
        // Get the actual review objects associated with those IDs and get average lighting level 
        Review.aggregate([
            { $match: { _id: { $in: workspace.reviews } } },
            { $group: { _id: workspace._id, average: { $avg: '$lightingLevel' } } }
        ], (err, result) => {
        });
    });

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

module.exports.renderNewReviewForm = async (req, res) => {
    const { id } = req.params;
    const reviewWorkspace = await Workspace.findById(id);
    res.render(`reviews/new`, { workspace: reviewWorkspace });
};