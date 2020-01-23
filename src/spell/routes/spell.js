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
  var result; // 교정 결과 Object
  var context = req.body['context'];
  var errCount = 0; // 에러 카운트
  
  hanspell.spellCheckByPNU(context, 6000, console.log, end, error, function(message){
    result = message;
});

  for(var i = 0; i < result.length; i++){
    errCount += result[i].length;
    for(var j = 0; j < result[i].length; j++){
      context = context.replace(result[i][j]['token'], result[i][j]['suggestions'][0]);
    }
  }

  res.send(context);
})

module.exports = router;
