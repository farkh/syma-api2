const Transaction = require('../models/Transaction');

const createTransaction = async (req, res) => {
    try {
        const { category_id, type, description, amount } = req.body;
        const transaction = new Transaction({
            type, category_id, amount, description,
        });

        await transaction.save();

        return res.status(200).json({ success: true, transaction });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err });
    }
};

const getTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) return res.status(404).json({ success: false, msg: 'No transaction found with that ID' });

        return res.status(200).json({ success: true, transaction });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err });
    }
};

const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();

        if (!transactions) return res.status(404).json({ success: false, msg: 'No transactions found' });

        return res.status(200).json({ success: true, transactions });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err });
    }
};

module.exports = {
    createTransaction,
    getTransaction,
    getTransactions,
};
