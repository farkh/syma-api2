const mongoose = require('mongoose');
const { Schema } = mongoose;

const requiredTransactionSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
    },
    type: {
        type: Number,
        required: true,
        default: 0,
    },
    description: {
        type: String,
        required: true,
        min: 3,
        max: 20,
    },
    amount: {
        type: Number,
        required: true,
        default: 0,
    },
    date: {
        type: Date,
        required: true,
    },
});

module.exports = RequiredTransaction = mongoose.model('RequiredTransaction', requiredTransactionSchema);
