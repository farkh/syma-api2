const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
    createRequiredTransaction,
    getRequiredTransaction,
    getRequiredTransactions,
    getRequiredTransactionsByType,
    getRequiredTransactionsByCategory,
} = require('../controllers/requiredTransaction.controller');

// @route   POST api/required/transactions
// @desc    Create required transaction
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), createRequiredTransaction);

// @route   GET api/required/transactions/type/:type
// @desc    Get all required transactions by type
// @access  Private
router.get('/type', passport.authenticate('jwt', { session: false }), getRequiredTransactionsByType);

// @route   GET api/required/transactions/one/:id
// @desc    Get required transaction
// @access  Private
router.get('/one/:id', passport.authenticate('jwt', { session: false }), getRequiredTransaction);

// @route   GET api/required/transactions/all
// @desc    Get all required transactions
// @access  Private
router.get('/all', passport.authenticate('jwt', { session: false }), getRequiredTransactions);

// @route   GET api/required/transactions/category
// @desc    Get all required transactions by category id
// @access  Private
router.get('/category', passport.authenticate('jwt', { session: false }), getRequiredTransactionsByCategory);

module.exports = router;
