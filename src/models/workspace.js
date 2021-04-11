const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review");
const opts = { toJSON: { virtuals: true } };

const lightingOptions = ["Dim lighting", "Acceptable lighting", "Good lighting", "Excellent lighting"]; 
const noiseOptions = ["Quiet space", "Neutral noise-level", "Noisy space", "Loud space"]; 
const wifiAvailabilityOptions = ["No wifi", "Free wifi", "Paid wifi"];
const spaceAvailablityOptions = ["Confined space", "Space for individuals", "Space for small groups", "Space for large groups"];

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

workspaceSchema.virtual("attributesDescription").get( function() {
    let lightingDescription = GetLightingAttributeDescription(this.averageLightingLevel); 
    let noiseDescription = GetNoiseAttributeDescription(this.averageNoiseLevel); 
    let wifiDescription = GetWifiAttributeDescription(this.averageWifiAvailability); 
    let spaceDescription = GetSpaceAttributeDescription(this.averageSpaceAvailable); 

    let attributes = [];
    if (lightingDescription) attributes.push(lightingDescription);
    if (noiseDescription) attributes.push(noiseDescription);
    if (wifiDescription) attributes.push(wifiDescription);
    if (spaceDescription) attributes.push(spaceDescription);

    return (attributes.join(", "));
});

workspaceSchema.virtual("hasAttributes").get( function() {
    let lightingDescription = GetLightingAttributeDescription(this.averageLightingLevel); 
    let noiseDescription = GetNoiseAttributeDescription(this.averageNoiseLevel); 
    let wifiDescription = GetWifiAttributeDescription(this.averageWifiAvailability); 
    let spaceDescription = GetSpaceAttributeDescription(this.averageSpaceAvailable); 

    return (lightingDescription || noiseDescription || wifiDescription || spaceDescription);
});

workspaceSchema.virtual("lightingAttributeDescription").get( function() {
    let lightingDescription = GetLightingAttributeDescription(this.averageLightingLevel); 
    return lightingDescription;
});

workspaceSchema.virtual("noiseAttributeDescription").get( function() {
    let noiseDescription = GetNoiseAttributeDescription(this.averageNoiseLevel); 
    return noiseDescription;
});

workspaceSchema.virtual("wifiAttributeDescription").get( function() {
    let wifiDescription = GetWifiAttributeDescription(this.averageWifiAvailability); 
    return wifiDescription;
});

workspaceSchema.virtual("spaceAttributeDescription").get( function() {
    let spaceDescription = GetSpaceAttributeDescription(this.averageSpaceAvailable); 
    return spaceDescription;
});

function GetLightingAttributeDescription(lightingOption) {
    if (typeof lightingOption == "undefined") return ""; 
    return (`${lightingOptions[Math.round(lightingOption)]}`);
}

function GetNoiseAttributeDescription(noiseOption) {
    if (typeof noiseOption == "undefined") return ""; 
    return (`${noiseOptions[Math.round(noiseOption)]}`);
}

function GetWifiAttributeDescription(wifiOption) {
    if (typeof wifiOption == "undefined") return ""; 
    return (wifiOption > 2 ? "" : `${wifiAvailabilityOptions[Math.round(wifiOption)]}`);
}

function GetSpaceAttributeDescription(spaceOption) {
    if (typeof spaceOption == "undefined") return ""; 
    return (`${spaceAvailablityOptions[Math.round(spaceOption)]}`);
}

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