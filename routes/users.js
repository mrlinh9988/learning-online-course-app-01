const express = require('express');
const router = express.Router();
const UserModel = require('../models/User').UserModel;
const checkToken = require('../middleware/checkToken');

// router.use(checkToken);

/* GET users listing. */
router.get('/', checkToken, function (req, res, next) {
  res.send('respond with a resource');
});


router.post('/login', (req, res, next) => {
  const { username, password, email } = req.body;

});


router.post('/signup', async (req, res, next) => {
  const { username, password, email } = req.body;
  let user = await UserModel.create({ username, password, email });
  res.json(user)
});

module.exports = router;
