const User = require('../models/User');
const UserSettings = require('../models/UserSettings');
const RequiredTransaction = require('../models/RequiredTransaction');

const TransactionTypes = require('../constants/transactionTypes');

const _calculateReqExpensesBeforePayment = async (user_id, paydate) => {
    const requiredExpenses = await RequiredTransaction.find({ user_id, type: TransactionTypes.EXPENSE });
    const currDate = new Date().getDate();
    let requiredExpense = 0;
    for (let i = 0; i < requiredExpenses.length; i++) {
        if (requiredExpenses[i].date >= currDate && requiredExpenses[i].date < paydate) {
            requiredExpense += requiredExpenses[i].amount;
        }
    }

    return requiredExpense;
};

const _calculateDayLimit = async ({
    user_id,
    isSavedThisMonth,
    numberOfDaysBeforePayment,
    paydate,
    curr_balance,
    savings_percent,
}) => {
    const requiredExpense = await _calculateReqExpensesBeforePayment(user_id, paydate);
    let dayLimit = 0;

    if (isSavedThisMonth) {
        dayLimit = (curr_balance - requiredExpense) / numberOfDaysBeforePayment;
    } else {
        dayLimit = (curr_balance * (1 - savings_percent * 0.01) - requiredExpense) / numberOfDaysBeforePayment;
    }

    return dayLimit;
};

const _getNumberOfDaysBeforePayment = ({ advance_date, paydate }) => {
    const date = new Date();
    const currentDate = date.getDate();
    let advanceDate = advance_date;

    if (advance_date > 31) {
        const lastDateOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        advanceDate = lastDateOfMonth;
    }

    // If advance
    if (advanceDate && typeof advanceDate === 'number') {
        if (currentDate < advanceDate && currentDate > paydate) {
            return advanceDate - currentDate + 1;
        } else if (currentDate < advanceDate) {
            return paydate - currentDate + 1;
        } else {
            return 0;
        }
    }

    // If no advance
    if (currentDate > paydate) {
        const date = new Date();
        const currMonthsLastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        return paydate + currMonthsLastDate - currentDate + 1;
    } else if (currentDate < paydate) {
        return paydate - currentDate + 1;
    } else {
        return 0;
    }
};

const createUserSettings = async (req, res) => {
    try {
        const existing = await UserSettings.findOne({ user_id: req.user.id });

        if (existing) return res.status(400).json({ success: false, msg: 'UserSettings already exists' });

        const userSettings = new UserSettings({
            user_id: req.user.id,
            day_limit: 0,
            paydate: 15,
            curr_balance: 0,
        });

        const user = await User.findById(userSettings.user_id);

        if (!user) return res.status(404).json({ success: false, msg: 'User not found' });

        await userSettings.save();
        user.userSettings = userSettings._id;
        await user.save();
        
        return res.status(200).json({ success: true, userSettings });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err });
    }
};

const getUserSettings = async (req, res) => {
    try {
        const userSettings = await UserSettings.findOne({ user_id: req.user.id });

        if (!userSettings) return res.status(404).json({ success: false, msg: 'No user settings found with that ID' });

        return res.status(200).json({
            success: true,
            ...userSettings._doc,
            advance_date: userSettings.advance_date ? userSettings.advance_date : 0,
        });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err });
    }
};

const updateUserSettings = async (req, res) => {
    try {
        let userSettings = await UserSettings.findOne({ user_id: req.user.id });
        if (!userSettings) return res.status(404).json({ success: false, msg: 'UserSettings not found' });

        const { body: userSettingsInput } = req;

        const paydate = +userSettingsInput.paydate || userSettings.paydate;
        const advance_date = (+userSettingsInput.advance_date || +userSettingsInput.advance_date === 0) ?
            +userSettingsInput.advance_date :
            userSettings.advance_date;
        const savings_percent = (+userSettingsInput.savings_percent || +userSettingsInput.savings_percent === 0) ?
            +userSettingsInput.savings_percent :
            userSettings.savings_percent;
        const curr_balance = +userSettingsInput.curr_balance || userSettings.curr_balance;
        const isSavedThisMonth = typeof userSettingsInput.isSavedThisMonth === 'boolean' ?
            userSettingsInput.isSavedThisMonth :
            userSettings.isSavedThisMonth;

        let numberOfDaysBeforePayment = 0;
        let dayLimit = curr_balance;

        numberOfDaysBeforePayment = _getNumberOfDaysBeforePayment({ advance_date, paydate });

        if (numberOfDaysBeforePayment === 0) {
            dayLimit = curr_balance;
        
            await UserSettings.findOneAndUpdate({ user_id: req.user.id }, {
                paydate,
                advance_date: advance_date === 0 ? null : advance_date,
                savings_percent: savings_percent === 0 ? null : savings_percent,
                isSavedThisMonth,
                curr_balance,
                day_limit: Math.round(dayLimit),
            }, { useFindAndModify: false });
            const updatedUserSettings = await UserSettings.findOne({ user_id: req.user.id });

            return res.status(200).json({ success: true, updatedUserSettings });
        }
        
        dayLimit = await _calculateDayLimit({
            user_id: req.user.id,
            numberOfDaysBeforePayment,
            isSavedThisMonth,
            paydate,
            curr_balance,
            savings_percent,
        });

        await UserSettings.findOneAndUpdate({ user_id: req.user.id }, {
            paydate,
            advance_date: advance_date === 0 ? null : advance_date,
            savings_percent: savings_percent === 0 ? null : savings_percent,
            isSavedThisMonth,
            curr_balance,
            day_limit: Math.round(dayLimit),
        }, { useFindAndModify: false });
        const updatedUserSettings = await UserSettings.findOne({ user_id: req.user.id });
        
        return res.status(200).json({
            success: true,
            ...updatedUserSettings._doc,
            advance_date: updatedUserSettings.advance_date ? updatedUserSettings.advance_date : 0,
        });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err });
    }
};

const deleteUserSettings = async (req, res) => {
    try {
        const userSettings = await UserSettings.findOne({ user_id: req.user.id });
        const user = await User.findById(req.user.id);

        if (!userSettings) return res.status(404).json({ success: false, msg: 'UserSettings not found' });

        userSettings.remove();
        user.userSettings = null;
        user.save();

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, msg: err });
    }
};

module.exports = {
    createUserSettings,
    getUserSettings,
    updateUserSettings,
    deleteUserSettings,
    _calculateDayLimit,
    _calculateReqExpensesBeforePayment,
    _getNumberOfDaysBeforePayment,
};
