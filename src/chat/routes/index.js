var express = require('express');
var router = express.Router();

var room = require('../model/room');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('temp.html');
});

//room logic
router.use('/room', require('./room'));

module.exports = router;
