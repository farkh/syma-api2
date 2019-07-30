const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSettingsSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    total_income: {
        type: Number,
        required: true,
        default: 0,
    },
    total_required_expenses: {
        type: Number,
        required: true,
        default: 0,
    },
    savings_percent: {
        type: Number,
        required: true,
        default: 0.3,
    },
    day_limit: {
        type: Number,
        required: true,
    },
});

module.exports = UserSettings = mongoose.model('UserSettings', userSettingsSchema);
