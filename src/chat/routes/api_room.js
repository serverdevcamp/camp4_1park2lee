var express = require('express');
var router = express.Router();
let handleDb = require('../module/handleDb');
let wSocket = require('../module/socket');

const {room, room_members, room_chats, user, friend} = require('../models');
let connected_cli = wSocket.connected_cli;
let chat = require('../model/chat');

//Create room
router.post('/', async function (req, res) {
    let {userIds, roomName} = req.body;
    if (!userIds) {
        res.status(200).json({
            message: "방의 멤버를 정해주세요."
        });
        return;
    }

    if (!roomName) {
        let members = [];

        for (let userId of userIds) {
            let user_each = await user.findByPk(userId);
            members.push(user_each.nickname);
        }
        roomName = members.join(", ");
        if (roomName.length >= 20) {
            roomName = roomName.substr(0, 17) + "...";
        }
    }

    await room.create({
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

                    await room_members.create({
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
    let sockets = require('../bin/www').sockets;
    const userID = req.params.userId;
    const roomID = req.params.roomId;
    // connected_cli.get(("connect:" + userID), (err, value) => {
    //     let memberSocket = sockets.alarm.sockets[value];
    //     console.log(memberSocket);
    //     if (typeof memberSocket != "undefined"){
    //         console.log('alarm socket off: ',roomID);
    //         memberSocket.leave(roomID);
    //     }
    // });
    let roomInfo = await handleDb.readRoom(userID, roomID);

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

    let isP2P = false;
    let user_in_db = await user.findByPk(userId);

    if (user_in_db.myroom === roomId) { //개인 채팅방
        user_in_db.myroom = null;
        user_in_db.save();
    } else {
        let userFriend = await friend.count({ // 1:1 채팅방
            where: {user: userId, room: roomId}
        });

        if (userFriend > 0) isP2P = true;
    }

    room_members.count({
        where: {room_id: roomId}
    }).then(async (c) => {
        if (!isP2P && c <= 1) {
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

    let roomInfo = await room.findByPk(req.params.roomId);

    for (let userId of userIds) {
        await room_members.create({
            room_id: roomInfo.id,
            user_id: userId,
            room_name: roomInfo.room_name,
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
        "memberLatestChatStime": null
    });

});


module.exports = router;
