const sync_request = require('sync-request');

var rooms = require('../model/room');
var chats = require('../model/chat');

module.exports = {
    checkSpell : async( userID, chatID ) => {
        var chat = await chats.findById(chatID);
        var response = sync_request('POST', 'http://localhost:3000/spell', {
            json: {
                userId: userID,
                reqId: chatID
            }
        })
        if (!response.err && response.statusCode == 200) {
            var result = response.getBody('utf8');
            console.log(result)
            
            if(errCount != 0){
                chat.checkContext = result.correct;
                chat.spellCheck = 0;
            }else{
                chat.spellCheck = 1;
            }

            /*
            프론트 처리 어떻게 할지
            */
           
            chat.save()
            .then(( afterCheck ) => {
                console.log("spell check 완료 :", afterCheck);
            })
            .catch((err) => {
                console.log("spell check 실패 :", err);
            })
        }
    }
}

/* 각각 의미하는 부분 
  res.json({
    correct:context,
    errors:errCount,
    requestId:rId,
  }
*/
