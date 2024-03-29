const mongoose = require('mongoose');
const { Schema } = mongoose;

const defaultCategorySchema = new Schema({
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
    isDefault: {
        type: Boolean,
        required: true,
        default: true,
    },
});

module.exports = Category = mongoose.model('DefaultCategory', defaultCategorySchema);
