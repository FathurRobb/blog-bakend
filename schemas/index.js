const mongoose = require("mongoose");
require('dotenv').config();

const connect = () => {
    var environment = process.env.NODE_ENV || 'development';

    const option = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
    mongoose
        .connect(environment === 'development' ? process.env['MONGO_DEV'] : process.env['MONGO_PROD'], option)
        .catch(err => console.log(err));
};

mongoose.connection.on("error", err => {
    console.error("MongoDB connection error", err);
});

module.exports = connect;