const mongoose = require('mongoose');
const config = require('config');

const mongoURI = config.get('mongoURI');

const connectDB = async () => {
    await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
    });
    console.log('MongoDB Connected...');
};

const closeConnectionDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('MongoDB Connection Closed.');
    } catch (err) {
        console.error(`MongoDB Connection Closing Error: ${err}`);
        process.exit(1);
    }
};

module.exports = { connectDB, closeConnectionDB };
