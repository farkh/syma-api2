const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
    createUserSettings,
    getUserSettings,
    updateUserSettings,
    deleteUserSettings,
} = require('../controllers/userSettings.controller');

// @route   POST api/userSettings
// @desc    Create UserSettings
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), createUserSettings);

// @route   GET api/userSettings
// @desc    Get UserSettings
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), getUserSettings);

// @route   PATCH api/userSettings/:id
// @desc    Update UserSettings
// @access Private
router.patch('/', passport.authenticate('jwt', { session: false }), updateUserSettings);

// @route   DELETE api/userSettings/:id
// @desc    Delete UserSettings
// @access  Private
router.delete('/', passport.authenticate('jwt', { session: false }), deleteUserSettings);

module.exports = router;
