const mongoose = require("mongoose");
const Workspace = (require("../models/workspace"));
const cities = require("./cities");
const { places, descriptors } = require("./seedhelpers");

mongoose.connect('mongodb://localhost:27017/crammify', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
    await Workspace.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const rando = Math.floor(Math.random() * 1000);
        const newSpace = new Workspace({
            location: `${cities[rando].city}, ${cities[rando].state}`,
            author: "603c4d23a8af4d5144793151",
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1930&q=80'
                },
                {
                    url: 'https://images.unsplash.com/photo-1482350325005-eda5e677279b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80'
                },
                {
                    url: 'https://images.unsplash.com/photo-1546889270-7605b5b38aa1?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTN8fGNhZmV8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                },
                {
                    url: 'https://images.unsplash.com/photo-1529022805552-1c88a713c1c5?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MjB8fGNhZmV8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                },
                {
                    url: 'https://images.unsplash.com/photo-1562771335-b1fe8b4ea78f?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxzZWFyY2h8MjR8fGNhZmV8ZW58MHx8MHw%3D&auto=format&fit=crop&w=500&q=60'
                },
                {
                    url: 'https://images.unsplash.com/photo-1558395005-21408ae65920?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTZ8fGJpc3Ryb3xlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                },
                {
                    url: 'https://images.unsplash.com/photo-1474899420076-a61e74989430?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTl8fGJpc3Ryb3xlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                },
                {
                    url: 'https://images.unsplash.com/photo-1605193672852-074b95f878d7?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MjZ8fGJpc3Ryb3xlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                },
                {
                    url: 'https://images.unsplash.com/photo-1498471731312-b6d2b8280c61?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8YmlzdHJvfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                },
                {
                    url: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mnx8cGFya3xlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                },
                {
                    url: 'https://images.unsplash.com/photo-1540712637209-536447be3137?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTF8fHBhcmt8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                },
                {
                    url: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mjh8fHN0dWR5fGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                },
                {
                    url: 'https://images.unsplash.com/photo-1604882737274-4afaddefec9b?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NDd8fHN0dWR5fGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                },
                {
                    url: 'https://images.unsplash.com/photo-1604882736764-6152df6dc4eb?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NTF8fHN0dWR5fGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                }
            ],
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae, aspernatur impedit. A beatae explicabo, odit suscipit praesentium ex quos delectus hic alias soluta blanditiis eveniet, facere nobis quis eum distinctio."
        });
        await newSpace.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});