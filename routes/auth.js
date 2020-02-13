const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const passport = require('passport');


/* POST login. */
router.post('/login', function (req, res, next) {

    passport.authenticate('local', { session: false }, (err, user, info) => {
        console.log('user: ', user);
        console.log(err);
        if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                user: user
            });
        }

        req.login(user, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }

            const payload = { 
                _id: user._id,
                username: user.username
            }

            const token = jwt.sign(payload, 'your_jwt_secret');
            // console.log(token);

            return res.json({ user, token });
        });
    })(req, res);

});

module.exports = router;