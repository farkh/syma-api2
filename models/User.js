const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        requried: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 32,
    },
    username: {
        type: String,
        required: true,
        min: 4,
    },
});

module.exports = User = mongoose.model('User', userSchema);
