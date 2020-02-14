const express = require('express');
const router = express.Router();
const UserModel = require('../models/User').UserModel;
const checkToken = require('../middleware/checkToken');

router.get('/', checkToken, async (req, res, next) => {
  // res.send('respond with a resource');
  try {
    const users = await UserModel.find();
    console.log(users);
    res.json(users)
  } catch (error) {
    console.log(error);
    res.status(500).json(error)
  }

});

router.post('/signup', async (req, res, next) => {
  const { username, password, email } = req.body;
  let user = await UserModel.create({ username, password, email });
  res.json(user);
});

module.exports = router;
