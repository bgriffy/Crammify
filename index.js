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

app.get("/", (req, res) => {
    res.send("Home page!");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        res.send("It worked!!");
        // req.login(registeredUser, err => {
        //     if (err) return next(err);
        //     req.flash("success", "Welcome to Crammify!");
        //     res.redirect("/campgrounds");
        // })
    } catch (error) {
        // req.flash("error", error.message);
        res.send(`ERROR: ${error}`);
    }
})

app.listen(3000, () => {
    console.log("Listening on port 3000...")
}); 