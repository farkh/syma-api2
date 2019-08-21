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
    editable: {
        type: Boolean,
        required: true,
        default: true,
    },
});

module.exports = Category = mongoose.model('Category', categorySchema);
