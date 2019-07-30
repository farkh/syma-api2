const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    type: {
        type: Number,
        required: true,
        default: 0,
    },
    name: {
        type: String,
        required: true,
        min: 3,
        max: 20,
    },
});

module.exports = Category = mongoose.model('Category', categorySchema);
