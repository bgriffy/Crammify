const Workspace = (require("../models/workspace"));
const {cloudinary} = require("../cloudinary");

module.exports.index = async (req, res) => {
    const workspaces = await Workspace.find({});
    res.render("workspaces/index", { workspaces });
};

module.exports.renderNewWorkspaceForm = (req, res) => {
    res.render("workspaces/new");
};

module.exports.createWorkspace = async (req, res, next) => {
    const newWorkspace = new Workspace(req.body.workspace);
    newWorkspace.author = req.user._id;
    await newWorkspace.save();
    if (!newWorkspace) {
        req.flash("error", "Could not create new workspace.");
        return res.redirect("/workspaces/new");
    }
    res.redirect(`/workspaces/${newWorkspace._id}`);
};

module.exports.showWorkspace = async (req, res) => {
    const { id } = req.params;
    const workspace = await Workspace.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");
    if (!workspace) {
        req.flash("error", "The request workspace does not exist.");
        return res.redirect("/workspaces");
    }
    res.render("workspaces/show", { workspace });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const workspace = await Workspace.findById(id);
    if (!workspace) {
        req.flash("error", "Workspace does not exist.");
        return res.redirect("/workspaces");
    }
    res.render("workspaces/edit", { workspace });
};

module.exports.updateWorkspace = async (req, res) => {
    const { id } = req.params;
    const workspace = await Workspace.findByIdAndUpdate(id, { ...req.body.workspace });
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    const imagesToDelete = req.body.deleteImages;

    if(imagesToDelete){
        for(let filename of imagesToDelete) {
            await cloudinary.uploader.destroy(filename); 
        }
        await workspace.updateOne({$pull: {images: {filename: {$in: imagesToDelete} } } } )
    }

    workspace.images.push(...images);
    await workspace.save();

    req.flash("success", "Workspace has been successfully updated.");
    res.redirect(`/workspaces/${id}`);
};

module.exports.deleteWorkspace = async (req, res) => {
    const { id } = req.params;
    await Workspace.findByIdAndDelete(id);
    req.flash("success", "Workspace has been successfully deleted.");
    res.redirect("/workspaces");
}