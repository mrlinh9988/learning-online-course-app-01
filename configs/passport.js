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
        callbackURL: "https://e0d37202.ngrok.io/auth/facebook/callback"
    },
        async function (accessToken, refreshToken, profile, done) {
            // console.log('alo');
            // console.log(profile);

            try {
                const user = await UserModel.findOne({ 'facebook.id': profile.id });
                console.log('user fb_id: ', user);
                if (user) {
                    done(null, profile.id);
                } else {
                    console.log('khong co user fb');
                    const newUser = new UserModel();
                    newUser.facebook.id = profile.id;
                    newUser.facebook.name = profile.displayName;
                    console.log(newUser);

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
        usernameField: 'email',
        passwordField: 'password'
    },
        async function (email, password, cb) {
            console.log(email);
            console.log(password);
            //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
            UserModel.findOne({ 'local.email': email }).lean()
                .then(async user => {

                    if (!user) {
                        return cb(null, false, { message: 'Email not found' });
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
        usernameField: 'email',
        passwordField: 'password'
    },
        function (email, password, done) {
            console.log(email);
            console.log(password);

            UserModel.findOne({ 'local.email': email }, async function (err, user) {
                console.log('find user: ', user);
                if (err)
                    return done(err);

                if (user) {
                    return done(null, false);
                } else {
                    // Nếu chưa user nào sử dụng email này
                    // tạo mới user
                    var newUser = new UserModel();
                    // lưu thông tin cho tài khoản local
                    newUser.local.email = email;
                    newUser.local.password = await hashPassword(password);
                    // newUser.local.email = await hashPassword(password);
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