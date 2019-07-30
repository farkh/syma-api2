const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
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
    datetime: {
        type: Date,
        required: true,
        default: new Date().toISOString(),
    },
});

module.exports = Transaction = mongoose.model('Transaction', transactionSchema);
