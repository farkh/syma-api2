const RequiredTransaction = require('../../models/RequiredTransaction');
const User = require('../../models/User');
const Category = require('../../models/Category');

module.exports = {
    createRequiredTransaction: async (args, req) => {
        if (!req.isAuth) throw new Error('Unauthenticated');

        const { category_id, type, description, amount, date } = args.requiredTransaction;

        const requiredTransaction = new RequiredTransaction({
            user_id: req.userId,
            category_id,
            type,
            description,
            amount,
            date,
        });

        try {
            const user = await User.findById(requiredTransaction.user_id);
            const category = await Category.findById(requiredTransaction.category_id);

            if (!user) throw new Error('User not found');

            await requiredTransaction.save();
            user.requiredTransactions.push(requiredTransaction);
            await user.save();
            
            return {
                ...requiredTransaction._doc,
                user_id: user,
                category_id: category,
            };
        } catch (err) {
            throw err;
        }
    },
    requiredTransaction: async (args, req) => {
        if (!req.isAuth) throw new Error('Unauthenticated');

        const { _id } = args;

        try {
            const requiredTransaction = await RequiredTransaction.findById(_id);
            const user = await User.findById(req.userId);
            const category = await Category.findById(requiredTransaction.category_id);

            if (!requiredTransaction || requiredTransaction.user_id != req.userId) {
                throw new Error('RequiredTransaction not found');
            }

            return {
                ...requiredTransaction._doc,
                user_id: user,
                category_id: category,
            };
        } catch (err) {
            throw err;
        }
    },
    requiredTransactions: async (args, req) => {
        if (!req.isAuth) throw new Error('Unauthenticated');

        try {
            const user = await User.findById(req.userId);
            const requiredTransactions = await RequiredTransaction.find({ user_id: req.userId });

            return requiredTransactions.map(async (requiredTransaction) => {
                const category = await Category.findById(requiredTransaction.category_id);
                
                return {
                    ...requiredTransaction._doc,
                    user_id: user,
                    category_id: category,
                };
            });
        } catch (err) {
            throw err;
        }
    },
    requiredTransactionsByType: async (args, req) => {
        if (!req.isAuth) throw new Error('Unauthenticated');

        const { type } = args;

        try {
            const user = await User.findById(req.userId);
            const requiredTransactions = await RequiredTransaction.find({ user_id: req.userId, type });

            return requiredTransactions.map(async (requiredTransaction) => {
                const category = await Category.findById(requiredTransaction.category_id);

                return {
                    ...requiredTransaction._doc,
                    user_id: user,
                    category_id: category,
                };
            });
        } catch (err) {
            throw err;
        }
    },
};
