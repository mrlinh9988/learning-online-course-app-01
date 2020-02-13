
var FacebookStrategy = require('passport-facebook').Strategy;
var UserModel = require('../models/User').UserModel;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


module.exports = function (passport) {
    // Facebook Strategy
    passport.use(new FacebookStrategy({
        clientID: 577997806089812,
        clientSecret: 'e8db94e14aac039db5b49736481e7e7b',
        callbackURL: "https://33e0e7c2.ngrok.io/auth/facebook/callback"
    },
        async function (accessToken, refreshToken, profile, done) {
            console.log(accessToken);

            // console.log('refeshToken: ', refreshToken);
            console.log(profile);
            console.log(typeof profile.id);
            // const data = {
            //     accessToken, profile
            // }
            // done(null, data);
            try {
                const user = await UserModel.findOne({ facebookId: profile.id });
                console.log('user fb_id: ', user);
                if (!user) {
                    done(null, false);
                }

                done(null, user.facebookId)
            } catch (error) {
                done(error);
            }


            // UserModel.find({ facebookId: profile.id }, function (err, user) {
            //     return done(err, user);
            // });
        }
    ));


    // local strategy
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
        function (username, password, cb) {
            console.log(username);
            console.log(password);
            //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
            UserModel.findOne({ username, password }).lean()
                .then(user => {
                    console.log('user find: ', user);
                    if (!user) {
                        return cb(null, false);
                    }
                    return cb(null, user);
                })
                .catch(err => cb(err));

        }
    ));


    passport.serializeUser(function (user, done) {
        console.log('serialize user: ', user);
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        console.log('deserialize user: ', user);

        done(null, user)
        // User.findById(id, function (err, user) {
        //     done(err, user);
        // });
    });
}