const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.URL;

const connectToMongo = async () => {
    await mongoose.connect(url);
};

module.exports = connectToMongo;
