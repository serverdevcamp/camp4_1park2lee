var express = require('express');
var router = express.Router();

var room = require('../model/room');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../../public', 'index.html')); 
});

//room
router.use('/room', require('./room'));
router.use('/api/room',require('./api_room'));

module.exports = router;
