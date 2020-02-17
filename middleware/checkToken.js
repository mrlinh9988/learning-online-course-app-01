const jwt = require('jsonwebtoken');
const UserModel = require('../models/User').UserModel;
const clientRedis = require('../configs/clientRedis');
const util = require('util');
clientRedis.get = util.promisify(clientRedis.get);
// clientRedis.lrange = util.promisify(clientRedis.lrange);

module.exports = async function (req, res, next) {
    try {
        // check ID facebook
        const userId = await clientRedis.get('userId');
        console.log(userId);

        if (userId) {
            console.log('da dang nhap bang FB');
            return next();
        }
        // console.log('chua dang nhap bang FB');


        // Check header token
        if (!req.headers.authorization) {
            return res.json({
                error: 'You need to login!'
            });
        }

        const token = req.headers.authorization.split(' ')[1];

        // check backlist token
        clientRedis.lrange('token', 0, -1, (err, result) => {
            // console.log('backlist: ', result);

            if (result.includes(token)) {
                console.log('ton tai trong blacklist');
                return res.status(400).json({
                    error: 'Invalid Token'
                });
            }
        });

        // decode token
        const decode = await jwt.verify(token, 'your_jwt_secret');

        if (!decode) {
            return res.status(404).json({
                error: 'Not found'
            });
        }

        const user = await UserModel.findById(decode._id)

        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        next()

        // console.log(user);
        // res.json(user)
        // next()
    } catch (error) {
        res.status(500).send(error)
    }
}