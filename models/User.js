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
    avatar: {
        type: String,
        required: true,
    },
    categories: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category',
        },
    ],
    transactions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Transaction',
        },
    ],
    requiredTransactions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'RequiredTransactions',
        },
    ],
    userSettings: {
        type: Schema.Types.ObjectId,
        ref: 'UserSettings',
    },
});

module.exports = User = mongoose.model('User', userSchema);
