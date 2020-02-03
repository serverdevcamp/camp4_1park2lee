let sync_request = require('sync-request');

let chats = require('../model/chat');
let request = require('request');


module.exports = {
    checkSpell : async( userID, chatID ) => {

        let chat = await chats.findById(chatID);

        request.post({
            url: 'http://127.0.0.1:3001/spell',
            form: {
                context: chat.origin_context,
                reqId: userID,
                userId: chatID
            }
        }, (err, response, body) => {

            if (!response.err && response.statusCode == 200) {

                //console.log(body);
                result = JSON.parse(body)

                if (result.errors != 0) {
                    chat.check_context =result.correct;
                    chat.status = 0;
                } else {
                    chat.status = 1;
                }
                chat.save()
                    .then(( afterCheck ) => {
                        console.log("spell check 완료");
                    })
                    .catch((err) => {
                        console.log("spell check 실패 :", err);
                    })
                }

        });
    }
}

