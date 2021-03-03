const mongoose = require("mongoose");
const Workspace = (require("../models/workspace"));
const User = (require("../models/user"));
const cities = require("./cities");
const { places, descriptors } = require("./seedhelpers");

mongoose.connect('mongodb://localhost:27017/crammify', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getSampleAuthor = () => User.findOne({ "username": "bob" });


const seedDB = async () => {
    await Workspace.deleteMany({});
    const sampleAuthor = await getSampleAuthor();
    for (let i = 0; i < 300; i++) {
        const rando = Math.floor(Math.random() * 1000);
        const newSpace = new Workspace({
            author: sampleAuthor._id,
            location: `${cities[rando].city}, ${cities[rando].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [],
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae, aspernatur impedit. A beatae explicabo, odit suscipit praesentium ex quos delectus hic alias soluta blanditiis eveniet, facere nobis quis eum distinctio."
        });
        await newSpace.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});