const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/User');
const UserSettings = require('../models/UserSettings');

const register = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) return res.status(400).json({ msg: 'User already exist' });

        const { email, username, password, confirm } = req.body;

        if (password !== confirm) return res.status(400).json({ msg: 'Passwords must match' });

        const avatar = gravatar.url(req.body.email, {
            s: '200', // Size
            r: 'pg', // Rating
            d: 'mm' // Default
        });
        
        const user = new User({
            email, username, password, avatar,
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, async (err, hash) => {
                if (err) throw err;

                user.password = hash;

                await user.save();

                const userSettings = new UserSettings({
                    user_id: user._id,
                    day_limit: 0,
                    paydate: 15,
                    curr_balance: 0,
                });

                await userSettings.save();
                user.userSettings = userSettings;
                user.save();

                return res.status(200).json({ success: true, user });
            });
        });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ msg: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({ msg: 'Password incorrect' });

        const payload = { id: user.id, username: user.username, avatar: user.avatar };
        const secretOrKey = config.get('secretOrKey');

        jwt.sign(
            payload,
            secretOrKey,
            { expiresIn: '2h' },
            (err, token) => {
                res.json({
                    success: true,
                    token: `Bearer ${token}`
                });
            },
        );
    } catch (err) {
        return res.status(500).json({ success: false, msg: err });
    }
};

const currentUser = async (req, res) => {
    try {
        const user = {
            id: req.user.id,
            username: req.user.username,
            email: req.user.email,
        };
        return res.status(200).json({ success: true, user });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err });
    }
};

module.exports = {
    register,
    login,
    currentUser,
};
