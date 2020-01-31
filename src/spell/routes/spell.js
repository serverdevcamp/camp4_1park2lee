var express = require('express');
var router = express.Router();
var mysql = require('../modules/mysql.js')
var redis = require('../modules/redis')
const spellCheck = require('../modules/spell-check.js')


const end = function () {
  console.log("<교정 종료>");
};
const error = function (err) {
  console.error("<error: " + err + ">");
};


/* GET users listing. */
router.get('/', function (req, res, next) {
  mysql.responseRank(function (reply) {
    res.json(reply);

  });
});
router.get('/:id', function (req, res, next) {
  mysql.responseUserRank(req.params.id,3,function(jsonData){
    res.json(jsonData);
  })
});

router.post('/', function (req, res, next) {
  var result; // 교정 결과 Object

  var context = req.body['context'];
  var rId = req.body['reqId'];
  var uId = req.body['userId'];
  if (context == undefined || rId == undefined) {
    res.status(400);
    res.render('인자가 부족합니다.');
  }

  var errCount = 0; // 에러 카운트

  spellCheck(context, 6000, console.log, end, error, function (message) {
    result = message;
  });
  res.status(200);

  if (result.length == 0) {
    res.send(context);
    return;
  } else {

    for (var i = 0; i < result.length; i++) {
      for (var j = 0; j < result[i].length; j++) {
        token = result[i][j]['token'];
        suggestion = result[i][j]['suggestions'][0];

        if (token == suggestion) continue;
        context = context.replace(token, suggestion);
        errCount++;
        var data = [token, suggestion]
        mysql.getWords(data, uId)

      }
    }
    res.json({
      correct: context,
      errors: errCount,
      requestId: rId,
    })
  }
})

module.exports = router;