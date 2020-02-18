var express = require('express');
var router = express.Router();
const path = require('path');

/* GET home page. */
router.get('/', function (req, res, next) {
  title = '\\uploads\\1582013526455-trungquandev-nop.png'
  res.render('index', { title });
});

module.exports = router;
