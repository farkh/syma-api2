const express = require('express');
const router = express.Router();
const passport = require('passport');

const { createTransaction, getTransaction, getTransactions } = require('../controllers/transaction.controller');

// @route   POST api/transactions
// @desc    Create transaction
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), createTransaction);

// @route   GET api/transactions/:id
// @desc    Get transaction
// @access  Private
router.get('/:id', passport.authenticate('jwt', { session: false }), getTransaction);

// @route   GET api/transactions
// @desc    Get all transactions
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), getTransactions);

module.exports = router;
