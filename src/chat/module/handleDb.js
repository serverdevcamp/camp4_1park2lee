let { room, user, room_chats, room_members } = require('../models');
let chats = require('../model/chat');

let spell = require('./spellCheck');

let sequelize = require('../models/index').sequelize;
const op = require('sequelize').Op;
const rule = require('../data/rank_rule')
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
                .then( async(chat_in_db) => {
                    let member_in_db = await user.findByPk(chat_in_db.speaker);
                    //console.log(chat_in_db)
                    let chat_info = {
                        "chatUserName": member_in_db.name,
                        "chatUserId": chat_in_db.speaker,
                        "chatMsg": chat_in_db.origin_context,
                        "chatStatus" : chat_in_db.status,
                        "chatCheck" : chat_in_db.check_context,
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
    },
    calcUserRank: () =>{
        let rankUp = [];
        let rankDown = [];
        
        sequelize.query("SELECT * FROM `user` WHERE DATE(latest_access_date) >= DATE_SUB(NOW(), INTERVAL 6 DAY)", { type: sequelize.QueryTypes.SELECT})
        .then(users => {
            for(let user_in_db of users){
                if (user_in_db.score < rule[user_in_db.grade][0] && user_in_db.grade > 2) rankDown.push(user_in_db.id);
                else if (user_in_db.score > rule[user_in_db.grade][1] && user_in_db.grade < 6) rankUp.push(user_in_db.id);
            }

            if (rankUp.length > 0){
                user.update({
                    score: 1000,
                    grade: sequelize.literal('grade + 1')
                },{
                    where : {
                    id: {
                        [op.in]: rankUp
                      }
    
                }
            })
            }

            if (rankDown.length > 0){
                user.update({
                    score: 1000,
                    grade: sequelize.literal('grade - 1')
                },{
                    where : {
                    id: {
                        [op.in]: rankDown
                      }
    
                }
            })
            }
            
        })


    }
}
