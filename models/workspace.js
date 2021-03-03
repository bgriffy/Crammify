const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review");
const opts = { toJSON: { virtuals: true } };

const imageSchema = new Schema({
    url: String,
    filename: String
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
    ]
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