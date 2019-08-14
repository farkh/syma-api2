const UserSettings = require('../../models/UserSettings');
const User = require('../../models/User');
const RequiredTransaction = require('../../models/RequiredTransaction');

const TransactionTypes = require('../../constants/transactionTypes');

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

module.exports = {
    createUserSettings: async (args, req) => {
        if (!req.isAuth) throw new Error('Unauthenticated');

        const existing = await UserSettings.findOne({ user_id: req.userId });

        if (existing) throw new Error('UserSettings already exists');

        const userSettings = new UserSettings({
            user_id: req.userId,
            day_limit: 0,
            paydate: 15,
            curr_balance: 0,
        });

        try {
            const user = await User.findById(userSettings.user_id);

            if (!user) throw new Error('UserSettings not found');

            await userSettings.save();
            user.userSettings = userSettings._id;
            await user.save();
            
            return {
                ...userSettings._doc,
                user_id: user,
            };
        } catch (err) {
            throw err;
        }
    },
    updateUserSettings: async (args, req) => {
        if (!req.isAuth) throw new Error('Unauthenticated');

        try {
            let userSettings = await UserSettings.findOne({ user_id: req.userId });
            const user = await User.findById(req.userId);
            if (!userSettings) throw new Error('UserSettings not found');

            const { userSettings: userSettingsInput } = args;
            const paydate = userSettingsInput.paydate || userSettings.paydate;
            const advance_date = userSettingsInput.advance_date || userSettings.advance_date;
            const savings_percent = userSettingsInput.savings_percent || userSettings.savings_percent;
            const curr_balance = userSettingsInput.curr_balance || userSettings.curr_balance;
            const isSavedThisMonth = typeof userSettingsInput.isSavedThisMonth === 'boolean' ?
                userSettingsInput.isSavedThisMonth :
                userSettings.isSavedThisMonth;

            const currentDate = new Date().getDate();
            let numberOfDaysBeforePayment = 0;
            let dayLimit = curr_balance;

            if (currentDate > paydate) {
                const date = new Date();
                const currMonthsLastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
                numberOfDaysBeforePayment = paydate + currMonthsLastDate - currentDate;
            } else if (currentDate < paydate) {
                numberOfDaysBeforePayment = paydate - currentDate;
            } else {
                dayLimit = curr_balance;
                
                await UserSettings.findOneAndUpdate({ user_id: req.userId }, {
                    paydate,
                    advance_date,
                    savings_percent,
                    isSavedThisMonth,
                    curr_balance,
                    day_limit: dayLimit,
                }, { useFindAndModify: false });
                const updatedUserSettings = await UserSettings.findOne({ user_id: req.userId });

                return {
                    ...updatedUserSettings._doc,
                    user_id: user,
                }
            }

            dayLimit = await _calculateDayLimit({
                user_id: req.userId,
                numberOfDaysBeforePayment,
                isSavedThisMonth,
                paydate,
                curr_balance,
                savings_percent,
            });

            await UserSettings.findOneAndUpdate({ user_id: req.userId }, {
                paydate,
                advance_date,
                savings_percent,
                isSavedThisMonth,
                curr_balance,
                day_limit: dayLimit,
            }, { useFindAndModify: false });
            const updatedUserSettings = await UserSettings.findOne({ user_id: req.userId });
            
            return {
                ...updatedUserSettings._doc,
                user_id: user,
            }
        } catch (err) {
            throw err;
        }
    },
    userSettings: async (args, req) => {
        if (!req.isAuth) throw new Error('Unauthenticated');

        try {
            const user = await User.findById(req.userId);
            const userSettings = await UserSettings.findOne({ user_id: req.userId });

            if (!userSettings || userSettings.user_id != req.userId) throw new Error('UserSettings not found');

            return { ...userSettings._doc, user_id: user._doc };
        } catch (err) {
            throw err;
        }
    },
};
