const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');

module.exports = {
    createUser: async args => {
        const { email, username, password, confirm } = args.userInput;

        try {
            const existingUserEmail = await User.findOne({ email });
            const existingUserName = await User.findOne({ username });

            if (existingUserEmail || existingUserName) throw new Error('User already exists');
            if (password !== confirm) throw new Error('Passwords must match');

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({
                email,
                username,
                password: hashedPassword,
            });

            user.save();

            const token = jwt.sign(
                { id: user._id },
                'myverysecretkey',
                {
                    expiresIn: 3600,
                },
            );

            return { token, password: null, ...user._doc };
        } catch (err) {
            throw err;
        }
    },
    login: async args => {
        const { email, password } = args;

        try {
            const user = await User.findOne({ email });

            if (!user) throw new Error('User with this email not found');

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) throw new Error('Invalid password');

            const token = jwt.sign(
                { id: user._id },
                'myverysecretkey',
                {
                    expiresIn: 3600,
                },
            );

            return { token, password: null, ...user._doc };
        } catch (err) {
            throw err;
        }
    },
    verifyToken: async args => {
        try {
            const decoded = await jwt.decode(args.token, 'myverysecretkey');
            const user = await User.findOne({ _id: decoded.id });

            return { ...user._doc, password: null };
        } catch (err) {
            throw err;
        }
    },
};
