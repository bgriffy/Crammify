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
    },
    lightingLevel: {
        type: Number,
        min: [0, "Lighting level cannot be less than zero."],
        max: [3, "Lighting level cannot be greather than three."]
    },
    spaceAvailable: {
        type: Number,
        min: [0, "Space available value cannot be less than zero."],
        max: [3, "Space available value cannot be greather than three."]
    },
    wifiAvailability: {
        type: Number,
        min: [0, "Wifi availability cannot be less than zero."],
        max: [3, "Wifi availability cannot be greather than three."]
    }
});

module.exports = mongoose.model("Review", reviewSchema);