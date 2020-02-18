const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const clientRedis = require('../configs/clientRedis');
const util = require('util');
clientRedis.get = util.promisify(clientRedis.get);
// clientRedis.lrange = util.promisify(clientRedis.lrange);

module.exports = async function (req, res, next) {
    try {
        // check ID facebook
        const userId = await clientRedis.get('userId');
        const id = jwt.verify(userId, 'userId');
   
        if (id) {

            console.log('da dang nhap bang FB');
            const user = await UserModel.findOne({ 'facebook.id': id.userId });
            req.type = user.type
            return next();

        }

        const token = req.headers.authorization.split(' ')[1];
        if (token) {
            console.log('token111111111: ', token);

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
            // console.log('token: ', token);
            // decode token
            const decode = await jwt.verify(token, 'your_jwt_secret');
            // console.log('decode: ', decode);

            if (!decode) {
                return res.status(404).json({
                    error: 'Not found'
                });
            }

            const user = await UserModel.findById(decode._id);
            // console.log('user1: ', user);

            if (!user) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }

            req.token = token;
            req.type = user.type;
            req.user = user;
            return next();
        }

    } catch (error) {
        res.status(500).json({
            error: 'You need to login!'
        });
    }
}