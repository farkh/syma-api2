const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const config = require('config');

const User = mongoose.model('User');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.get('secretOrKey');

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
            const user = await User.findById(jwt_payload.id);
            
            if (user) return done(null, user);

            return done(null, false);
        }),
    );
};
