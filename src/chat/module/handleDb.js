let { room, user, room_chats, room_members } = require('../models');
let chats = require('../model/chat');

let spell = require('./spellCheck');

module.exports = {
    /*
    이때 방 정보에서 chat이 있는 방 정보만 가져오는 거로 수정할 것! roomInfo
   */
    readRoom: async (userId, roomId) => {

        let user_in_db = await user.findByPk(userId);
        let room_members_in_db = await room_members.findOne({
            where : { user_id : userId, room_id : roomId }
        });
        let room_chats_in_db = await room_chats.findAll({
            where : { room_id: roomId }
        });

        let chatList = []
        for (let room_chat of room_chats_in_db) {
            await chats.findById(room_chat.chat_id)
                .then((chat_in_db) => {
                    //console.log(chat_in_db)
                    let chat_info = {
                        "chatUserName": chat_in_db.speaker,
                        "chatUserId": chat_in_db.speaker,
                        "chatMsg": chat_in_db.origin_context,
                    }
                    return chat_info;
                })
                .then((resultChat) => {
                    chatList.push(resultChat)
                    //console.log(chatList)
                });
        }

        let result = {
            "userName":  user_in_db.name,
            "userId": userId,
            "roomName": room_members_in_db.room_name,
            "roomId": roomId,
            "chatList": chatList
        }
        //console.log(result)

        return result;

    },

    saveChat: (content) => {

        var chatModel = new chats();
        chatModel.speaker = content.user;
        chatModel.origin_context = content.msg;
        chatModel.room = content.room;
        chatModel.save()
            .then(async function (newChat) {
                spell.checkSpell(newChat.speaker, newChat._id); //spell 서버 요청

                console.log(`대화 "${newChat.origin_context}" 저장 완료`)

                room_chats.create({
                    room_id: newChat.room,
                    chat_id: String(newChat._id)
                }).then((new_room_chats) => {
                    console.log("room_chats 저장 완료")
                }).catch((err) => {
                    console.log(err,"room_chats 저장 실패")
                })
            })
            .catch((err) => {
                console.log("대화 저장 실패:", err)
            })
    }
}
