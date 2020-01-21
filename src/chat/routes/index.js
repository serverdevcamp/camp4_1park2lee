var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render(__dirname + '/../views/temp.html');
});

module.exports = router;
