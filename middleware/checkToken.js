const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const clientRedis = require('../configs/clientRedis');
const util = require('util');
clientRedis.get = util.promisify(clientRedis.get);
// clientRedis.lrange = util.promisify(clientRedis.lrange);

module.exports = async function (req, res, next) {
    try {

        const token = req.headers.authorization.split(' ')[1];
        console.log(token);


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
        // const decode = await jwt.verify(token, 'userId');
        console.log('decode: ', decode);

        if (!decode) {
            return res.status(404).json({
                error: 'Not found'
            });
        }

        // const user = await UserModel.findById(decode._id);
        // const user = await UserModel.findOne({ 'facebook.id': decode.user });
        const user = await UserModel.findOne({ $or: [{ '_id': decode._id }, { 'facebook.id': decode.user }] });
        console.log('user1: ', user);


        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        req.type = user.type;
        req.user = user;
        next()

        // console.log(user);
        // res.json(user)
        // next()
    } catch (error) {
        res.status(500).json({
            error: 'You need to login!'
        });
    }
}