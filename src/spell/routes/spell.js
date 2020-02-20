var express = require('express');
var router = express.Router();
var mysql = require('../modules/mysql.js');

const spellCheck = require('../modules/spell-check.js');

/* GET users listing. */
router.get('/', function (req, res, next) {
    console.log('spell get test');
    mysql.responseRank(function (reply) {
        if (typeof reply == "undefined" || reply == null) {
            res.status(200).json({
                status: -1,
                err: '랭킹정보가 존재하지 않습니다.'
            });
        }
        if (typeof reply == "string") reply = JSON.parse(reply);
        res.status(200).json(reply);
    });
});

router.get('/:id', function (req, res, next) {
    mysql.responseUserRank(req.params.id, 3, function (result) {
        res.status(200).json(result);
    })
});

router.post('/', function (req, res, next) {
    let context = req.body['context'];
    let rId = req.body['reqId'];
    let uId = req.body['userId'];
    if (typeof context == "undefined" || typeof rId == "undefined") {
        res.json({
            status: -2,
            err: '인자가 부족합니다.'
        });
        return;
    }

    let errCount = 0; // 에러 카운트
    spellCheck(context, 3000, function (message, err) {
        if (err) {
            res.json({
                status: -1,
                err: err
            });
        } else {
            for (var i = 0; i < message.length; i++) {
                for (var j = 0; j < message[i].length; j++) {

                    token = message[i][j]['token'];
                    suggestion = message[i][j]['suggestions'][0];

                    if (token === suggestion) continue;
                    context = context.replace(token, suggestion);
                    errCount++;
                    let data = [token, suggestion];
                    mysql.getWords(data, uId);

                }
            }
            res.json({
                status: 1,
                correct: context,
                errors: errCount,
                requestId: rId,
            })
        }
    });
})

module.exports = router;