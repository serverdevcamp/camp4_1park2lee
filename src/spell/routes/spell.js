var express = require('express');
var router = express.Router();
const hanspell = require('hanspell');

const end = function () { console.log("<ends>"); };
const error = function (err) { console.error("<error: " + err + ">"); };


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('spell');
});

router.post('/',function(req, res, next){
 
 
  res.send(req.body)
})

module.exports = router;
