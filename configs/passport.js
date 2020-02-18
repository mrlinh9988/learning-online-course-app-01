
var FacebookStrategy = require('passport-facebook').Strategy;
var UserModel = require('../models/User');
const LocalStrategy = require('passport-local').Strategy;
const hashPassword = require('../utils/hashPassword').hassPassword;
const comparePassword = require('../utils/hashPassword').comparePassword;


module.exports = function (passport) {

    // Facebook Strategy
    passport.use(new FacebookStrategy({
        clientID: 577997806089812,
        clientSecret: 'e8db94e14aac039db5b49736481e7e7b',
        callbackURL: "https://a908b9c8.ngrok.io/auth/facebook/callback"
    },
        async function (accessToken, refreshToken, profile, done) {

            try {
                const user = await UserModel.findOne({ 'facebook.id': profile.id });
                // console.log('user fb_id: ', user);
                if (user) {
                    done(null, profile.id);
                } else {
                    console.log('khong co user fb');
                    const newUser = new UserModel();
                    newUser.facebook.id = profile.id;
                    newUser.facebook.name = profile.displayName;
                    // console.log(newUser.facebook.id);

                    // lưu vào db
                    newUser.save(function (err) {
                        if (err)
                            throw err;
                        // nếu thành công, trả lại user
                        console.log('new user: ', newUser);
                        return done(null, newUser.facebook.id);
                    });
                }

                // done(null, user.facebookId)
            } catch (error) {
                done(error);
            }
        }
    ));

    passport.serializeUser(function (user, done) {
        console.log('step serialize', user);
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        console.log('step deserialize', user);
        UserModel.findOne({ 'facebook.id': user }, function (err, user) {
            if (err) {
                return done(err);
            }
            console.log('user find: ', user);
            done(null, user);
        });
    });


    // LOGIN LOCAL
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
        async function (username, password, cb) {
            console.log(username);
            console.log(password);
            //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
            UserModel.findOne({ 'local.username': username }).lean()
                .then(async user => {

                    if (!user) {
                        return cb(null, false, { message: 'Username not found' });
                    }

                    const isMatch = await comparePassword(password, user.local.password);
 
                    if (isMatch) {
                        return cb(null, user);
                    } else {
                        return cb(null, false, { message: 'Wrong password' });
                    }
                })
                .catch(err => cb(err));

        }
    ));


    // SIGNUP LOCAL
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
        function (username, password, done) {

            UserModel.findOne({ 'local.username': username }, async function (err, user) {
                // console.log(user);
                if (err)
                    return done(err);
                if (user) {
                    return done(null, false);
                } else {
                    // Nếu chưa user nào sử dụng email này
                    // tạo mới user
                    var newUser = new UserModel();
                    // lưu thông tin cho tài khoản local
                    newUser.local.username = username;
                    newUser.local.password = await hashPassword(password);
                    // lưu user
                    newUser.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });

        }));

}