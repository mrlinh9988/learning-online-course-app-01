const express = require('express');
const router = express.Router();
const UserModel = require('../models/User');
const checkToken = require('../middleware/checkToken');
const jwt = require('jsonwebtoken');

router.get('/', checkToken, async (req, res, next) => {
  // res.send('respond with a resource');
  try {
    if (req.type === 1) {
      const users = await UserModel.find();
      console.log('this is admin');
      res.json(users);

    } else {
      res.json({
        message: 'You are not allowed to use this feature'
      })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error)
  }

});

router.get('/verify', async (req, res, next) => {
  const { token } = req.query;
  console.log(token);
  try {
    const decode = await jwt.verify(token, 'verify_user');
    console.log('decode: ', decode);
    const user = await UserModel.findByIdAndUpdate(decode._id, { isVerify: 'active' }, { new: true });
    res.json(user);

  } catch (error) {
    res.status(500);
  }
});

router.get('/me', checkToken, (req, res) => {
  console.log(req.user);
  res.json(req.user)
});


module.exports = router;
