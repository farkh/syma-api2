const cron = require('node-cron');

const UserSettings = require('./models/UserSettings');
const {
    _calculateDayLimit,
    _getNumberOfDaysBeforePayment,
} = require('./controllers/userSettings.controller');

const updateUserSettings = async () => {
    const allUserSettings = await UserSettings.find({});

    if (!allUserSettings) return;

    allUserSettings.map(async (userSettings) => {
        const {
            user_id,
            isSavedThisMonth,
            paydate,
            advance_date,
            savings_percent,
            curr_balance,
        } = userSettings;
        const numberOfDaysBeforePayment = _getNumberOfDaysBeforePayment({
            advance_date,
            paydate,
        });
        const newDayLimit = await _calculateDayLimit({
            user_id,
            numberOfDaysBeforePayment,
            isSavedThisMonth,
            paydate,
            curr_balance,
            savings_percent,
        });

        userSettings.day_limit = newDayLimit;
        console.log('NEW DAY LIMIT', newDayLimit);

        await userSettings.save();
    });
};

cron.schedule('40 23 * * *', () => {
    updateUserSettings();
});
