if(process.env.NODE_ !== "production"){
    require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const User = require("./models/user");
const Workspace = require("./models/workspace");
const Review = require("./models/review");
const { isLoggedIn, validateWorkspace, isAuthor, validateReview, isReviewAuthor } = require("./middleware");
const multer = require("multer");
const { storage, cloudinary } = require("./cloudinary");
const upload = multer({ storage });
const catchAsync = require("./utils/CatchAsync");
//controllers
const workspaces = require("./controllers/workspaces");
const reviews = require("./controllers/reviews");
const users = require("./controllers/users");

const dbUrl = "mongodb://localhost:27017/crammify";

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

//----middleware----
app.use(mongoSanitize());
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(helmet({ contentSecurityPolicy: false }));

const secret = "thisshouldbeabettersecret"

const sessionConfig = {
    // store,
    // secure: true,
    name: "custom-session",
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        HttpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/", (req, res) => {
    res.render("home");
});


//----USER ROUTES----
app.get("/register", users.renderRegisterForm);
app.post("/register", catchAsync(users.registerUser));
app.get("/login", users.renderLoginForm);
app.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), users.login);
app.get("/logout", users.logout);

//----WORKSPACE ROUTES----
app.get("/workspaces", catchAsync(workspaces.index));
app.get("/workspaces/new", isLoggedIn, workspaces.renderNewWorkspaceForm);
app.post("/workspaces", isLoggedIn, validateWorkspace, catchAsync(workspaces.createWorkspace));
app.get("/workspaces/:id", catchAsync(workspaces.showWorkspace));
app.get("/workspaces/:id/edit", isLoggedIn, workspaces.renderEditForm);
app.put("/workspaces/:id", isLoggedIn, isAuthor, upload.array("image"), validateWorkspace, catchAsync(workspaces.updateWorkspace));
app.delete("/workspaces/:id", isLoggedIn, isAuthor, catchAsync(workspaces.deleteWorkspace));

//----REVIEW ROUTES----
app.post("/workspaces/:id/reviews", isLoggedIn, validateReview, catchAsync(reviews.createReview));
app.delete("/workspaces/:workspaceID/reviews/:reviewID", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

app.use((err, req, res, next) => {
    if (!err.message) err.message = "Oh no, this sucks!!!";
    res.render("errors", { err });
});

app.listen(3000, () => {
    console.log("Listening on port 3000...")
}); 