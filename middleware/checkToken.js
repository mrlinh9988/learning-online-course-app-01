const jwt = require('jsonwebtoken');
const UserModel = require('../models/User').UserModel;

module.exports = async function (req, res, next) {
    // console.log(req.headers.authorization);
    if (!req.headers.authorization) {
        return res.json({
            error: 'You need to login!'
        });
    }
    const token = req.headers.authorization.split(' ')[1];

    // console.log(token);
    // res.json(token);

    try {
        const decode = await jwt.verify(token, 'your_jwt_secret');

        if (!decode) {
            return res.status(404).json({
                error: 'Not found'
            });
        }

        const user = await UserModel.findById(decode._id)
        // console.log(user);
        res.json(user)
    } catch (error) {
        res.status(500).send(error)
    }



}