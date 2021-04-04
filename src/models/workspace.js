const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review");
const opts = { toJSON: { virtuals: true } };

const imageSchema = new Schema({
    url: String,
    filename: String
});

imageSchema.virtual("thumbnail").get(function() {
    return this.url.replace("/upload", "/upload/w_200,h_150"); 
});

const workspaceSchema = new Schema({
    title: String,
    description: String,
    location: String,
    images: [imageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ], 
    averageLightingLevel: {
        type: Number, 
        min: [0, "Average lighting level cannot be less than zero."],
        max: [3, "Average lighting level cannot be greather than three."]
    }, 
    averageNoiseLevel: {
        type: Number, 
        min: [0, "Average noise level cannot be less than zero."],
        max: [3, "Average noise level cannot be greather than three."]
    }, 
    averageSpaceAvailable: {
        type: Number, 
        min: [0, "Average space available cannot be less than zero."],
        max: [3, "Average space available cannot be greather than three."]
    }, 
    averageWifiAvailability: {
        type: Number, 
        min: [0, "Average wifi-availability cannot be less than zero."],
        max: [3, "Average wifi-availability cannot be greather than three."]
    }

}, opts);

workspaceSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});

module.exports = mongoose.model("Workspace", workspaceSchema); 