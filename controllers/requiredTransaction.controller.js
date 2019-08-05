const RequiredTransaction = require('../models/RequiredTransaction');
const User = require('../models/User');

const createRequiredTransaction = async (req, res) => {
    try {
        const { category_id, type, description, amount, date } = req.body;
        const transaction = new RequiredTransaction({
            type, category_id, amount, description, user_id: req.user.id, date,
        });

        await transaction.save();
        const user = await User.findById(req.user.id);

        user.requiredTransactions.push(transaction);
        user.save();

        return res.status(200).json({ success: true, transaction });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err });
    }
};

const getRequiredTransaction = async (req, res) => {
    try {
        const transaction = await RequiredTransaction.findById(req.params.id);

        if (!transaction) return res.status(404).json({ success: false, msg: 'No required transaction found with that ID' });
        if (transaction.user_id != req.user.id) return res.status(404).json({ success: false, msg: 'No required transaction found with that ID' });

        return res.status(200).json({ success: true, transaction });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err });
    }
};

const getRequiredTransactions = async (req, res) => {
    try {
        const transactions = await RequiredTransaction.find({});

        if (!transactions) return res.status(404).json({ success: false, msg: 'No required transactions found' });

        return res.status(200).json({ success: true, transactions });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err });
    }
};

const getRequiredTransactionsByType = async (req, res) => {
    try {
        const transactions = await RequiredTransaction.find({ user_id: req.user.id, type: req.body.type });

        if (!transactions) return res.status(404).json({ success: false, msg: 'No required transactions found' });

        return res.status(200).json({ success: true, transactions });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err });
    }
};

const getRequiredTransactionsByCategory = async (req, res) => {
    try {
        const transactions = await RequiredTransaction.find({ user_id: req.user.id, category_id: req.body.category_id });

        if (!transactions) return res.status(404).json({ success: false, msg: 'No required transactions found' });

        return res.status(200).json({ success: true, transactions });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err });
    }  
};

module.exports = {
    createRequiredTransaction,
    getRequiredTransaction,
    getRequiredTransactions,
    getRequiredTransactionsByType,
    getRequiredTransactionsByCategory,
};
