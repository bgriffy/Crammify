const express = require("express");
const path = require("path");

if (process.env.NODE_ !== "production") {
    require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
}

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
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/crammify";
const workspaceRoutes = require("./routes/workspaces");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const MongoDBStore = require("connect-mongo")(session);

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

console.log(`dbURL: ${dbUrl}`);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

//----MIDDLEWARE----
app.use(mongoSanitize());
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(helmet({ contentSecurityPolicy: false }));

const secret = process.env.SECRET || "thisshouldbeabettersecret";

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
    store,
    secure: true,
    name: "custom-session",
    secret,
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

//----ROUTES----
app.get("/", (req, res) => {
    res.render("home");
});

//----MIDDLEWARE FOR ROUTES----
app.use("/", userRoutes);
app.use("/workspaces", workspaceRoutes);
app.use("/workspaces/:id/reviews", reviewRoutes);

app.use((err, req, res, next) => {
    if (!err.message) err.message = "Oh no, this sucks!!!";
    res.render("errors", { err });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Serving on port ${port}...`);
});