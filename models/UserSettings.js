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
        default: 30,
    },
    day_limit: {
        type: Number,
        required: true,
    },
    paydate: {
        type: Number,
        required: true,
    },
    advance_date: {
        type: Number,
    },
    curr_balance: {
        type: Number,
        required: true,
        default: 0,
    },
    isSavedThisMonth: {
        type: Boolean,
        required: true,
        default: false,
    },
});

module.exports = UserSettings = mongoose.model('UserSettings', userSettingsSchema);
