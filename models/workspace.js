const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };

const imageSchema = new Schema({
    url: String
});

const workspaceSchema = new Schema({
    title: String,
    description: String,
    location: String,
    images: [imageSchema]
}, opts);

module.exports = mongoose.model("Workspace", workspaceSchema); 