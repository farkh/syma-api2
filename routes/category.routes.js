const express = require('express');
const router = express.Router();
const passport = require('passport');

const { createCategory, getCategory, getCategories } = require('../controllers/category.controller');

// @route   POST api/categories
// @desc    Create category
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), createCategory);

// @route   GET api/categories/:id
// @desc    Get category
// @access  Private
router.get('/:id', passport.authenticate('jwt', { session: false }), getCategory);

// @route   GET api/categories
// @desc    Get all categories
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), getCategories);


module.exports = router;
