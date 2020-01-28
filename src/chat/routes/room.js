var express = require('express');
var router = express.Router();

var room = require('../model/room');
var chat = require('../model/chat');


//Create room
router.post('/', async function (req, res, next) {
  const {
    roomName,
    userId
  } = req.body; //방 이름과 만든 유저정보
  console.log(roomName, userId)

  //1. 파라미터체크
  if (!roomName || !userId) {
    res.status(200).json({
      message: "필수 정보를 입력하세요."
    });
    return;
  }

  //2. 방 생성
  var roomModel = new room()
  roomModel.name = roomName;
  roomModel.member.push(userId);
  roomModel.countUnread.push(0);
  roomModel.countMember = 1; //
  roomModel.save()
    .then((newRoom) => {
      console.log("Create 완료")
      res.status(200).json({
        message: "Create success",
        data: {
          room: newRoom
        }
      })
    })
    .catch((err) => {
      res.status(200).json({
        message: err
      })
    })
});

//방 입장 전 과정
router.get('/:userId', async function (req, res, next) {

  const User = req.params.userId;
  //console.log(user)
  var RoomInfo = [];
  const rooms_in_db = await room.find({
    member: {
      $in: [User]
    }
  })
  //console.log(rooms_in_db);
  rooms_in_db.forEach(room => {
    RoomInfo.push([room._id, room.name, room.member])
  });

  //console.log(RoomInfo);
  res.status(200).render('tempRoomList.ejs', {
    user: User,
    roomInfo: RoomInfo
  });
  return;

});


//방 입장
router.get('/:userId/:roomId', async function (req, res, next) {
  //나중에 여기 auth 미들웨어 이용, token 값으로 사용자 정보 가져와서 방 입장
  const userID = await req.params.userId;
  const roomID = await req.params.roomId;

  const room_in_db = await room.findOne({
    _id: roomID
  })

  try {
    res.status(200).render('tempRoom.ejs', {
      "userName": userID,
      "userId": userID,
      "roomName": room_in_db.name,
      "roomId": roomID
    });
    return;

  } catch (err) {
    res.status(200).json({
      message: "enter room - server error."
    })
    return;
  }
});

module.exports = router;