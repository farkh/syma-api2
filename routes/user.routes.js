const express = require('express');
const router = express.Router();
const passport = require('passport');

const { register, login, currentUser } = require('../controllers/user.controller');

// @route   GET api/user/test
// @desc    Test GET route
// @access  Public
router.post('/test', (req, res) => res.send('API works'));

// @route   POST api/user/register
// @desc    Register user
// @access  Public
router.post('/register', register);

// @route   POST api/user/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   GET api/user/current
// @desc    Return current user
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), currentUser);

module.exports = router;
