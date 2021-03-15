const mongoose = require("mongoose");
const Workspace = (require("../models/workspace"));
const User = (require("../models/user"));
const cities = require("./cities");
const { places, descriptors } = require("./seedhelpers");
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/crammify";

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

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getSampleAuthor = () => User.findOne({ "username": "bob" });

const sampleImages = [
    {
        "url": "https://res.cloudinary.com/bgriffy/image/upload/v1614810587/Crammify/zzsqt6u0yaikiowpib9h.jpg",
        "filename": "Crammify/zzsqt6u0yaikiowpib9h"
    },
    {
        "url": "https://res.cloudinary.com/bgriffy/image/upload/v1614810588/Crammify/ekyhqnjl39e8rsdihjzd.jpg",
        "filename": "Crammify/ekyhqnjl39e8rsdihjzd"
    },
    {
        "url": "https://res.cloudinary.com/bgriffy/image/upload/v1614810588/Crammify/r1bimcx0xf2ufmxqgicu.jpg",
        "filename": "Crammify/r1bimcx0xf2ufmxqgicu"
    },
    {
        "url": "https://res.cloudinary.com/bgriffy/image/upload/v1614810588/Crammify/ingljconptipkzqrzdk7.jpg",
        "filename": "Crammify/ingljconptipkzqrzdk7"
    },
    {
        "url": "https://res.cloudinary.com/bgriffy/image/upload/v1614810588/Crammify/j8bv0gqerbn7pmb08ahn.jpg",
        "filename": "Crammify/j8bv0gqerbn7pmb08ahn"
    },
    {
        "url": "https://res.cloudinary.com/bgriffy/image/upload/v1614810588/Crammify/yzc9funq5yycvgyoynhj.jpg",
        "filename": "Crammify/yzc9funq5yycvgyoynhj"
    },
    {
        "url": "https://res.cloudinary.com/bgriffy/image/upload/v1614810588/Crammify/qi4tmfschba8vyosvlvx.jpg",
        "filename": "Crammify/qi4tmfschba8vyosvlvx"
    },
    {
        "url": "https://res.cloudinary.com/bgriffy/image/upload/v1614810588/Crammify/hxkk4f6xnacpqclkzdqm.jpg",
        "filename": "Crammify/hxkk4f6xnacpqclkzdqm"
    },
    {
        "url": "https://res.cloudinary.com/bgriffy/image/upload/v1614810588/Crammify/xt0eluyzr7eldig4q9sz.jpg",
        "filename": "Crammify/xt0eluyzr7eldig4q9sz"
    },
    {
        "url": "https://res.cloudinary.com/bgriffy/image/upload/v1614810588/Crammify/toki2g8p3ixre8v38zyy.jpg",
        "filename": "Crammify/toki2g8p3ixre8v38zyy"
    },
    {
        "url": "https://res.cloudinary.com/bgriffy/image/upload/v1614810588/Crammify/amdbpn9lrcwgflfehc6f.jpg",
        "filename": "Crammify/amdbpn9lrcwgflfehc6f"
    },
    {
        "url": "https://res.cloudinary.com/bgriffy/image/upload/v1614810588/Crammify/llt3qfq6vjlhfsaf1mac.jpg",
        "filename": "Crammify/llt3qfq6vjlhfsaf1mac"
    }
];

const seedDB = async () => {
    await Workspace.deleteMany({});
    const sampleAuthor = await getSampleAuthor();
    for (let i = 0; i < 300; i++) {
        const rando = Math.floor(Math.random() * 1000);
        const newSpace = new Workspace({
            author: sampleAuthor._id,
            location: `${cities[rando].city}, ${cities[rando].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: sampleImages,
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae, aspernatur impedit. A beatae explicabo, odit suscipit praesentium ex quos delectus hic alias soluta blanditiis eveniet, facere nobis quis eum distinctio."
        });
        await newSpace.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});