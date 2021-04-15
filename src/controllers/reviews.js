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
    await SetAggregatesOnWorkspace(workspace);
    await workspace.save();

    req.flash("success", "Your review has been added successfully.");
    res.redirect(`/workspaces/${id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewID } = req.params;
    const workspace = await Workspace.findById(id);

    workspace.update({ $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    workspace.reviews = workspace.reviews.filter(review => !review.equals(reviewID));
    await SetAggregatesOnWorkspace(workspace);
    workspace.save(); 

    req.flash("success", "Review has been successfully deleted.");
    res.redirect(`/workspaces/${id}`);
};

//TODO: Refactor. Logic to delete attributes on workspace should probably be moved to workspace model. 
async function SetAggregatesOnWorkspace (workspace){
    if (workspace.reviews.length < 1) {
        return workspace.update({ $unset: { 
            averageLightingLevel: "", 
            averageNoiseLevel: "", 
            averageWifiAvailability: "", 
            averageSpaceAvailable: "" } 
        }); 
    }
    
    await Review.aggregate(
        [
            { $match: { _id: { $in: workspace.reviews } } },
            { $group: { _id: null, avgLightingLevel: {$avg: '$lightingLevel'}, 
                                   avgNoiseLevel: {$avg: '$noiseLevel'}, 
                                   avgWifiAvailability: {$avg: '$wifiAvailability'}, 
                                   avgSpaceAvailable: {$avg: '$spaceAvailable'} 
            }}, 
            { $limit: 1 }
        ], 

        async (err, result) => {
            workspace.averageLightingLevel = result.length > 0 ? result[0].avgLightingLevel : null;
            workspace.averageNoiseLevel = result.length > 0 ? result[0].avgNoiseLevel : null;
            workspace.averageWifiAvailability = result.length > 0 ? result[0].avgWifiAvailability: null;
            workspace.averageSpaceAvailable = result.length > 0 ? result[0].avgSpaceAvailable : null;
        });
}

module.exports.renderNewReviewForm = async (req, res) => {
    const { id } = req.params;
    const reviewWorkspace = await Workspace.findById(id);
    res.render(`reviews/new`, { workspace: reviewWorkspace });
};