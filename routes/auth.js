const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const clientRedis = require('../configs/clientRedis');
const util = require('util');
clientRedis.get = util.promisify(clientRedis.get);
const UserModel = require('../models/User');


// Local callback

// Signup
router.post('/signup', async (req, res, next) => {
    // const { username, password } = req.body;
    passport.authenticate('local-signup', { session: false }, (err, user) => {
        if (err) throw err;
        console.log('user: ', user._id);
        const payload = {
            _id: user._id
        }
        const verfyToken = jwt.sign(payload, 'verify_user');
        res.json({
            verfyToken
        });
    })(req, res, next);

});


// Login
router.post('/login', function (req, res, next) {

    passport.authenticate('local', { session: false }, (err, user, info) => {
        // console.log('user: ', user);
        console.log(err);
        if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                user: user
            });
        }

        req.login(user, { session: false }, (err) => {
            // console.log('user1: ', user);
            if (err) {
                res.send(err);
            }

            const payload = {
                _id: user._id,
                username: user.username
            }

            const token = jwt.sign(payload, 'your_jwt_secret');
            // console.log(token);

            return res.json({ token });
        });
    })(req, res);

});

// Logout
router.get('/logout', async function (req, res) {
    req.logout();
    const { userId } = req.query;
    try {

        // Logout facebook
        const userId = await clientRedis.get('userId');
        console.log(userId);
        if (userId) {
            clientRedis.del('userId');
            return res.json({
                message: 'Log out fb'
            });
        }

        // Log out 
        if (!req.headers.authorization) {
            return res.json({
                error: 'You need to login!'
            });
        }

        const token = req.headers.authorization.split(' ')[1];

        clientRedis.LPUSH('token', token, (err, backlist) => {
            if (err) throw err;

            console.log('backlist', backlist);

            return res.status(200).json({
                'status': 200,
                'data': 'You are logged out',
            });
        });

    } catch (error) {
        return res.status(400).json({
            'status': 500,
            'error': error.toString(),
        });
    }
    // res.json({
    //     message: 'log out'
    // });
});

// Facebook callback
router.get('/facebook',
    passport.authenticate('facebook', { scope: ['user_birthday', 'user_friends', 'public_profile', 'email', 'user_age_range', 'user_gender', 'user_hometown', 'user_likes', 'user_link', 'user_location', 'user_photos', 'user_posts', 'user_status', 'user_tagged_places', 'user_videos'] }));

router.get('/facebook/callback', (req, res, next) => {
    passport.authenticate('facebook', (err, user, next) => {
        console.log('userid: ', typeof user.facebook.id);
        clientRedis.set('userId', user.facebook.id);
        // res.json({ userId: user.facebook.id });
        res.json({
            message: 'Login success'
        });
    })(req, res, next);
});

module.exports = router;