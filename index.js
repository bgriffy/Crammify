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
    name: "custom-session",
    secret: secret,
    // sure: true,
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

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to Crammify!");
            res.redirect("/workspaces");
        })
    } catch (error) {
        req.flash("error", error.message);
    }
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
    req.flash("success", "You have successfully logged in!");
    res.redirect("/workspaces");
});

app.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Goodbye! Please come again! I'm nothing without you!!");
    res.redirect("/workspaces");
});

app.get("/workspaces", async (req, res) => {
    const workspaces = await Workspace.find({});
    res.render("index", { workspaces });
});

app.post("/workspaces", (req, res) => {
    //ADD NEW WORKSPACE
});

app.get("/workspaces/:id", async (req, res) => {
    const {id} = req.params; 
    const workspace = await Workspace.findById(id);   
    res.render("show", {workspace}); 
});

app.get("/workspaces/:id/edit", async(req, res) => {
    const {id} = req.params; 
    const workspace = await Workspace.findById(id);   
    if (!workspace) {
        req.flash("error", "Workspace does not exist.");
        return res.redirect("/workspaces");
    }
    res.render("edit", {workspace}); 
});

app.put("/workspaces/:id", async (req, res) => {
    const {id} = req.params; 
    const workspace = await Workspace.findByIdAndUpdate(id, { ...req.body.workspace });
    req.flash("success", "Workspace has been successfully deleted.");
    res.redirect(`/workspaces/${id}`);
});

app.delete("/workspaces/:id", async (req, res) => {
    const {id} = req.params; 
    await Workspace.findByIdAndDelete(id);   
    req.flash("success", "Workspace has been successfully deleted.");
    res.redirect("/workspaces"); 
});

app.use((err, req, res, next) => {
    if (!err.message) err.message = "Oh no, this sucks!!!";
    res.render("errors", { err });
});

app.listen(3000, () => {
    console.log("Listening on port 3000...")
}); 