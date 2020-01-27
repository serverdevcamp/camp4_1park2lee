var express = require('express');
var router = express.Router();
var mysql = require('../modules/mysql.js')
const hanspell = require('hanspell');
const spellCheck = require('../modules/spell-check.js')

// connection.query('SELECT * from Words', function(err, rows, fields) {
//   if (!err)
//     console.log('The solution is: ', rows);
//   else
//     console.log('Error while performing Query.', err);
// });

// connection.end();
const end = function () { console.log("<교정 종료>"); };
const error = function (err) { console.error("<error: " + err + ">"); };


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('spell');
});

router.post('/',function(req, res, next){
  var result; // 교정 결과 Object
  
    var context = req.body['context'];
    var chat_id = req.body['chat_id'];
    if (context == undefined || chat_id == undefined) {
    res.status(400);
    res.render('인자가 부족합니다.');
  }
  
  var errCount = 0; // 에러 카운트
  
//   hanspell.spellCheckByPNU(context, 6000, console.log, end, error, function(message){
//     result = message;
// });
spellCheck(context, 6000, console.log, end, error, function(message){
  result = message;
});
res.status(200);

if(result.length == 0){
  res.send(context);
}
else{
  for(var i = 0; i < result.length; i++){
    for(var j = 0; j < result[i].length; j++){
      token = result[i][j]['token'];
      suggestion = result[i][j]['suggestions'][0];
      if(token == suggestion) continue;
      context = context.replace(token, suggestion);

      var data = [token,suggestion]
      mysql.getWords(data)
      
    }
  }
  res.json({
    correct:context,
    errors:errCount,
    chat_id:chat_id
  }
  )
}
  
})

module.exports = router;
