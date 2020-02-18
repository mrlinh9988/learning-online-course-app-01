const express = require('express');
const router = express.Router();
const UserModel = require('../models/User');
const checkToken = require('../middleware/checkToken');

router.get('/', checkToken, async (req, res, next) => {
  // res.send('respond with a resource');
  try {
    console.log('type: ', req.type);
    if (req.type === 1) {
      const users = await UserModel.find();
      // console.log(users);
      res.send(users)
    } else {
      res.json({
        message: 'You can not use this feature'
      })
    }

  } catch (error) {
    console.log(error);
    res.status(500).send();
  }

});

router.post('/signup', async (req, res, next) => {
  const { username, password, email } = req.body;
  let user = await UserModel.create({ username, password, email });
  res.json(user);
});

router.get('/me', checkToken, (req, res) => {
  console.log(req.user);
  res.json(req.user)
});


module.exports = router;
