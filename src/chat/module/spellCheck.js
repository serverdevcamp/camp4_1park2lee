let sync_request = require('sync-request');

let chats = require('../model/chat');
let request = require('request');


module.exports = {
    checkSpell : async( userID, chatID ) => {

         let chat = await chats.findById(chatID);
        // 기본 request 방
        // request.post({
        //     url: 'http://127.0.0.1:3306/spell',
        //     body: {
        //         context: chat.origin_context,
        //         userId: userID,
        //         reqId: chatID
        //     },
        //     json: true
        //     },(err, httpResponse, body) => {
        //     if(err) {
        //         console.log("여기", err);
        //         return;
        //     }
        //     console.log(body)
        // })

        try {
            // let data = //JSON.parse(
            //     {
            //     context : chat.origin_context,
            //     userId: userID,
            //     reqId: chatID
            //     };

            console.log(typeof data,":",data)

            let response = sync_request('GET', 'http://127.0.0.1:3306/', {
                'context': chat.origin_context,
                'userId': String(userID),
                'reqId': String(chatID)
            });

            console.log("요청완료")
            if (!response.err && response.statusCode == 200) {
                let result = response.getBody('utf8');
                console.log(result)

                if (result.errCount != 0) {
                    chat.check_context = result.correct;
                    chat.status = 0;
                } else {
                    chat.status = 1;
                }
                chat.save()
                    .then(( afterCheck ) => {
                        console.log("spell check 완료 :", afterCheck);
                    })
                    .catch((err) => {
                        console.log("spell check 실패 :", err);
                    })
            }
        }catch(err){
            console.log(err);
        }
        // if (!response.err && response.statusCode == 200) {
        //     let result = response.getBody('utf8');
        //     console.log(result)
        //
        //     if(errCount != 0){
        //         chat.check_context = result.correct;
        //         chat.status = 0;
        //     }else{
        //         chat.status = 1;
        //     }

            /*
            프론트 처리 어떻게 할지
            */
           
            // chat.save()
            // .then(( afterCheck ) => {
            //     console.log("spell check 완료 :", afterCheck);
            // })
            // .catch((err) => {
            //     console.log("spell check 실패 :", err);
            // })
        }
}



/* 각각 의미하는 부분 
  res.json({
    correct:context,
    requestId:rId
  }
*/
