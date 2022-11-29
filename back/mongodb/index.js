//We use mongoose to connect to mongodb
const mongoose = require('mongoose');

//Seting up the connection to the local database
const MONGO_URI = process.env.MONGODB_URI;

//library called dotenv helps us to access the environment variables (process.env)

mongoose
    .connect(MONGO_URI)
    .then((x) => {
        const dbName = x.connections[0].name;
        console.log(`Connected to Mongo! Database name: "${dbName}"`);
    })
    .catch((err) => {
        console.error('Error connecting to mongo', err);
    });