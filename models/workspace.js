const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };
const workspaceSchema = new Schema({
    title: String,
    description: String,
    location: String,
}, opts);

module.exports = mongoose.model("Workspace", workspaceSchema); 