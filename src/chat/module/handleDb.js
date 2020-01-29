var rooms = require('../model/room');
var chats = require('../model/chat');

module.exports = {
    readRoom: async (userId, roomId) => {

        var chatList = []
        room_in_db = await rooms.findById(roomId)

        //room_in_db.chat.forEach( async (chatId) => 
        room_in_db.chat.forEach(new Promise((chatId) => {
            
            chats.findById(chatId)
            .then((chat_in_db) => {
                var chat_info = {
                    "chatUserName": chat_in_db.speaker,
                    "chatUserId": chat_in_db.speaker,
                    "chatMsg": chat_in_db.originContext,
                }
                return chat_info;
            })
            .then((result) => {
                console.log("대화 하나씩",result)
                chatList.push(result)
            })
        })
        )

        await Promise.all();
        
        console.log(chatList)
        
        // .then(() => {
        //     var result = {
        //         "userName": userId,
        //         "userId": userId,
        //         "roomName": room_in_db.name,
        //         "roomId": room_in_db._id,
        //         "chatList": chatList
        //     }
        //     console.log(result)
            
        //     return result;
        // });

    },

    saveChat: (content) => {

        var chatModel = new chat();
        chatModel.speaker = content.user;
        chatModel.originContext = content.msg;
        chatModel.room = content.room;
        chatModel.save()
            .then(async function (newChat) {
                console.log(`대화 "${newChat.originContext}" 저장완료`)

                room_in_db = await room.findById(content.room)
                room_in_db.chat.push(newChat._id)
                room_in_db.save()
                    .then((newRoom) => {
                        console.log(`${newRoom.name}에 대화 저장완료`)
                    })
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

/*
var chatSchema = new Schema({
    speaker : { type: Number, required: true } , //user id from MySQL
    time : { type: Date, default: Date.now(), required: true },
    originContext : { type: String, required: true },
    checkContext : { type: String, default: "" }, //맞춤법 교정된 내용
    spellCheck : { type: Number, default: -1 }, //맞춤법 교정 여부 및 결과 -1(미교정), 0(맞음), 1(틀림)
    room : { type: mongoose.Schema.Types.ObjectId, ref: 'room' } ,
},{ versionKey:'_somethingElse'})

content: {
                        method: 'server chat message',
                        user: socket.handshake.query.user,
                        room: socket.handshake.query.room,
                        msg: content.msg 
                    }
*/