const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
    createCategory,
    getCategory,
    getCategories,
    getCategoriesByType,
} = require('../controllers/category.controller');

// @route   POST api/categories
// @desc    Create category
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), createCategory);

// @route   GET api/categories/one/:id
// @desc    Get category
// @access  Private
router.get('/one/:id', passport.authenticate('jwt', { session: false }), getCategory);

// @route   GET api/categories
// @desc    Get all categories
// @access  Private
router.get('/all', passport.authenticate('jwt', { session: false }), getCategories);

// @route   GET api/categories/type/:type
// @desc    Get all categories by type
// @access  Private
router.get('/type/:type', passport.authenticate('jwt', { session: false }), getCategoriesByType);

module.exports = router;
