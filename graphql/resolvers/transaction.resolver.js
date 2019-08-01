const Transaction = require('../../models/Transaction');
const User = require('../../models/User');
const Category = require('../../models/Category');

module.exports = {
    createTransaction: async (args, req) => {
        if (!req.isAuth) throw new Error('Unauthenticated');

        const { category_id, type, description, amount } = args.transaction;

        const transaction = new Transaction({
            user_id: req.userId,
            category_id,
            type,
            description,
            amount,
        });

        try {
            const user = await User.findById(transaction.user_id);
            const category = await Category.findById(transaction.category_id);

            if (!user) throw new Error('User not found');

            await transaction.save();
            user.transactions.push(transaction);
            await user.save();
            
            return {
                ...transaction._doc,
                user_id: user,
                category_id: category,
            };
        } catch (err) {
            throw err;
        }
    },
    transaction: async (args, req) => {
        if (!req.isAuth) throw new Error('Unauthenticated');

        const { _id } = args;

        try {
            const transaction = await Transaction.findById(_id);
            const user = await User.findById(req.userId);
            const category = await Category.findById(transaction.category_id);

            if (!transaction || transaction.user_id != req.userId) throw new Error('Transaction not found');

            return {
                ...transaction._doc,
                user_id: user,
                category_id: category,
            };
        } catch (err) {
            throw err;
        }
    },
    transactions: async (args, req) => {
        if (!req.isAuth) throw new Error('Unauthenticated');

        try {
            const user = await User.findById(req.userId);
            const transactions = await Transaction.find({ user_id: req.userId });

            return transactions.map(async (transaction) => {
                const category = await Category.findById(transaction.category_id);
                
                return {
                    ...transaction._doc,
                    user_id: user,
                    category_id: category,
                };
            });
        } catch (err) {
            throw err;
        }
    },
    transactionsByType: async (args, req) => {
        if (!req.isAuth) throw new Error('Unauthenticated');

        const { type } = args;

        try {
            const user = await User.findById(req.userId);
            const transactions = await Transaction.find({ user_id: req.userId, type });

            return transactions.map(async (transaction) => {
                const category = await Category.findById(transaction.category_id);

                return {
                    ...transaction._doc,
                    user_id: user,
                    category_id: category,
                };
            });
        } catch (err) {
            throw err;
        }
    },
};
