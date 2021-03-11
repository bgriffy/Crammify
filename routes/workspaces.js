const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/CatchAsync");
const { isLoggedIn, validateWorkspace, isAuthor } = require("../middleware");
const multer = require("multer");
const { storage, cloudinary } = require("../cloudinary");
const upload = multer({ storage });
const workspaces = require("../controllers/workspaces");

router.route("/")
    .get(catchAsync(workspaces.index))
    .post(isLoggedIn, validateWorkspace, catchAsync(workspaces.createWorkspace));

router.route("/new").get(isLoggedIn, workspaces.renderNewWorkspaceForm);

router.route("/:id")
    .get(catchAsync(workspaces.showWorkspace))
    .put(isLoggedIn, isAuthor, upload.array("image"), validateWorkspace, catchAsync(workspaces.updateWorkspace))
    .delete(isLoggedIn, isAuthor, catchAsync(workspaces.deleteWorkspace)); 

router.route("/:id/edit").get(isLoggedIn, workspaces.renderEditForm);

module.exports = router;