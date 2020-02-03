let express = require('express');
let router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('temp.ejs');
});

//room
router.use('/room', require('./room'));

module.exports = router;
