var express = require('express');
var router = express.Router();
var handleDb = require('../module/handleDb');
var wSocket = require('../module/socket');

const {room, room_members, room_chats, user, friend} = require('../models');
let chat = require('../model/chat');

//Create room
router.post('/', async function (req, res, next) {
    let {userIds, roomName} = req.body;
    if (!userIds) {
        res.status(200).json({
            message: "방의 멤버를 정해주세요."
        });
        return;
    }

    //1. 파라미터체크
    if (!roomName) {
        let members = [];

        for (let userId of userIds) {
            let user_each = await user.findByPk(userId);
            members.push(user_each.name);
        }
        roomName = members.join(", ");
        if (roomName.length >= 20) {
            roomName = roomName.substr(0, 17) + "...";
        }

    }

    room.create({
        room_name: roomName
    }).then((newRoom) => {
        console.log(newRoom.id, "번 room 생성 완료");

        for (let userId of userIds) {

            user.findByPk(userId)
                .then(async (each_user) => {
                    if (userIds.length < 2) {
                        each_user.myroom = newRoom.id;
                        each_user.save();
                    } else if (userIds.length === 2) {
                        let friendID;

                        if (userId === userIds[0]) friendID = userIds[1];
                        else friendID = userIds[0];

                        let userFriend = await friend.findOne({
                            where: {user: userId, friend: friendID}
                        });
                        userFriend.room = newRoom.id;
                        userFriend.save();
                    }

                    room_members.create({
                        room_id: newRoom.id,
                        user_id: each_user.id,
                        room_name: newRoom.room_name
                    }).then((new_room_members) => {
                        console.log(`${new_room_members.room_id}방 ${new_room_members.user_id}의 room_members 생성 완료`);

                    }).catch((err) => {
                        console.log(err);
                    });

                }).catch((err) => {
                console.log(err);
                res.status(200).json({
                    err: err
                });
            });
        }

        wSocket.publish(JSON.stringify({
            method: 'message',
            sendType: 'sendToAllClientsInRoom',
            content: {
                method: 'invite room',
                members: userIds,
                id: newRoom.id
            }
        }));

        res.status(200).json({
            message: "room, room_members 각각 생성완료",
            id: newRoom.id
            //room: newRoom
        });
    }).catch((err) => {
        res.status(200).json({
            message: err
        });

    });
});

//방 입장 전 과정
router.get('/:userId', async function (req, res, next) {
    const User = req.params.userId;
    let RoomInfo = await handleDb.readRoomList(User);
    res.status(200).send(RoomInfo);

});

//방 입장
router.get('/:userId/:roomId', async function (req, res, next) {
    //나중에 여기 auth 미들웨어 이용, token 값으로 사용자 정보 가져와서 방 입장
    const userID = req.params.userId;
    const roomID = req.params.roomId;

    // let isInRoom = await room_members.count
    //유저의 latest chat id 갱신해주는 부분
    //await handleDb.updateLatestChat(userID, roomID); -> 퇴장할 때로 변경

    let roomInfo = await handleDb.readRoom(userID, roomID);

    /**
     * roomInfo = {
     *  "userName":  user_in_db.name,
     *  "userId": userId,
     *  "roomName": room_members_in_db.room_name,
     *  "roomId": roomId,
     *  "chatList": chatList
     *  }
     */

    try {
        res.status(200).send(roomInfo);
    } catch (err) {
        res.status(200).json({
            message: "enter room - server error."
        });
    }
});

//방 퇴
router.get('/out/:userId/:roomId', async function (req, res, next) {

    const userId = req.params.userId;
    const roomId = req.params.roomId;
    let isP2P = false;
    let user_in_db = await user.findByPk(userId);

    if (user_in_db.myroom === roomId) {
        user_in_db.myroom = null;
        user_in_db.save();
    } else {
        let userFriend = await friend.count({
            where: {user: userId, room: roomId}
        });

        if (userFriend > 0) isP2P = true;

    }

    room_members.count({
        where: {room_id: roomId}
    }).then(async (c) => {
        if (c > 1) {
            room_members.destroy({
                where: {
                    user_id: userId,
                    room_id: roomId
                }
            }).then((result) => {
                console.log("room_members", result, "행 삭제 완료")
            }).catch((err) => {
                console.log("room_members 삭제 실패", err)
            })

        } else {
            room_members.destroy({
                where: {
                    user_id: userId,
                    room_id: roomId
                }
            }).then((result) => {
                console.log("room_members", result, "행 삭제 완료")
            }).catch((err) => {
                console.log("room_members 삭제 실패", err)
            });


            room_chats.destroy({
                where: {
                    room_id: roomId
                }
            }).then((result) => {
                console.log("room_chats", result, "행 삭제 완료")
            }).catch((err) => {
                console.log("room_chats 디비 삭제 실패", err)
            });

            chat.deleteMany({room: roomId})
                .then((result) => {
                    console.log("chat 디비 모두 삭제 성공", result)
                })
                .catch((err) => {
                    console.log("chat 디비 모두 삭제 실패", err)
                });

            if (isP2P) return;

            room.destroy({
                where: {
                    id: roomId
                }
            }).then((result) => {
                console.log("room 디비 삭제 완료")
            }).catch((err) => {
                console.log("room 디비 삭제 실패", err)
            });

        }
    });
    res.status(200).send();
});

router.post('/in/:roomId', async function (req, res, next) {
    let userIds = req.body['userIds'];
    if (!userIds) {
        res.status(200).json({
            message: "초대 멤버가 없습니다.",
            status: -1
        });
        return;
    }
    let lastChatId = null;
    let lastChatStime = null;
    let roomInfo = await room.findByPk(req.params.roomId);

    lastChatId= await room_chats.max('id', {where : {'room_id': req.params.roomId }}).then(max => max);
    if (lastChatId != null && typeof lastChatId != "undefined") {
        let lastChat = await room_chats.findByPk(lastChatId);
        let lastChatObject = await chat.findById(lastChat.chat_id);
        lastChatStime = lastChatObject.stime;
    }

    for (let userId of userIds) {
        await room_members.create({
            room_id: roomInfo.id,
            user_id: userId,
            room_name: roomInfo.room_name,
            latest_chat_id: lastChatId,
            latest_chat_stime: lastChatStime
        }).then((new_room_members) => {
            console.log(`${new_room_members.room_id}방 ${new_room_members.user_id}의 room_members 생성 완료`);
        }).catch((err) => {
            console.log(err);
        });
    }

    wSocket.publish(JSON.stringify({
        method: 'message',
        sendType: 'sendToAllClientsInRoom',
        content: {
            method: 'invite room',
            members: userIds,
            id: roomInfo.id
        }
    }));

    res.status(200).send({
        "memberId": userIds,
        "memberLatestChatStime": lastChatStime
    });

});


module.exports = router;
