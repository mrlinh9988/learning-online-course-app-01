
var FacebookStrategy = require('passport-facebook').Strategy;
var UserModel = require('../models/User').UserModel;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


module.exports = function (passport) {
    // Facebook Strategy
    passport.use(new FacebookStrategy({
        clientID: 577997806089812,
        clientSecret: 'e8db94e14aac039db5b49736481e7e7b',
        callbackURL: "https://127f8ddc.ngrok.io/auth/facebook/callback"
    },
        async function (accessToken, refreshToken, profile, done) {

            try {
                const user = await UserModel.findOne({ facebookId: profile.id });
                console.log('user fb_id: ', user);
                if (user) {
                    done(null, profile.id);
                } else {
                    const newUser = new UserModel();
                    newUser.facebook.id = profile.id;
                    newUser.save();
                    done(null, newUser.facebook.id)
                }

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


    // Sign up
    passport.use('local-signup', new LocalStrategy({
        // mặc định local strategy sử dụng username và password,
        // chúng ta cần cấu hình lại
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // cho phép chúng ta gửi reqest lại hàm callback
    },
        function (req, email, password, done) {
            // asynchronous
            // Hàm callback của nextTick chỉ được thực hiện khi hàm trên nó trong stack (LIFO) được thực hiện
            // User.findOne sẽ không được gọi cho tới khi dữ liệu được gửi lại
            process.nextTick(function () {
                // Tìm một user theo email
                // chúng ta kiểm tra xem user đã tồn tại hay không
                User.findOne({ 'local.email': email }, function (err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        // Nếu chưa user nào sử dụng email này
                        // tạo mới user
                        var newUser = new User();
                        // lưu thông tin cho tài khoản local
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);
                        // lưu user
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));


}