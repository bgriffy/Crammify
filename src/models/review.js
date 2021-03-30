const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    noiseLevel: {
        type: Number,
        min: [0, "Noise level cannot be less than zero."],
        max: [3, "Noise level cannot be greather than three."]
    }
});

module.exports = mongoose.model("Review", reviewSchema);