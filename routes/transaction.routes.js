const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
    createTransaction,
    getTransaction,
    getTransactions,
    getTransactionsByType,
    getTransactionsByCategory,
    getTransactionsByDate,
    deleteTransaction,
} = require('../controllers/transaction.controller');

// @route   POST api/transactions
// @desc    Create transaction
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), createTransaction);

// @route   GET api/transactions/type/:type
// @desc    Get all transactions by type
// @access  Private
router.get('/type', passport.authenticate('jwt', { session: false }), getTransactionsByType);

// @route   GET api/transactions/one/:id
// @desc    Get transaction
// @access  Private
router.get('/one/:id', passport.authenticate('jwt', { session: false }), getTransaction);

// @route   GET api/transactions/all
// @desc    Get all transactions
// @access  Private
router.get('/all', passport.authenticate('jwt', { session: false }), getTransactions);

// @route   GET api/transactions/category
// @desc    Get all transactions by category id
// @access  Private
router.get('/category', passport.authenticate('jwt', { session: false }), getTransactionsByCategory);

// @route   GET api/transactions/date
// @desc    Get all transactions by date
// @access  Private
router.get('/date', passport.authenticate('jwt', { session: false }), getTransactionsByDate);

// @route   DELETE api/transactions/
// @desc    Delete transaction by id
// @access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteTransaction);


module.exports = router;
