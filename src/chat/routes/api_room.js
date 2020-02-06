var express = require('express');
var router = express.Router();
var handleDb = require('../module/handleDb')

const { room, room_members, user } = require('../models');
let chat = require('../model/chat');

//Create room
router.post('/', async function (req, res, next) {
    if (!userIds) {
        res.status(200).json({
          message: "방의 멤버를 정해주세요."
        });
        return;
      }

  //1. 파라미터체크
  if (!roomName) {
    let members = [];

    for(let userId of userIds){
      let user_each = await user.findByPk(userId)
      members.push(user_each.name);
    }
    roomName = members.join(", ");
    if(roomName.length >= 20){
      roomName = roomName.substr(0,17)+"...";
    }

  }

  room.create({
    room_name: roomName
  }).then((newRoom) => {
    console.log(newRoom.id,"번 room 생성 완료");

     for(let userId of userIds) {

       user.findByPk(userId)
           .then((each_user) => {

             room_members.create({
               room_id: newRoom.id,
               user_id: each_user.id,
               room_name: newRoom.room_name
             }).then((new_room_members) => {
               console.log(`${new_room_members.room_id}방 ${new_room_members.user_id}의 room_members 생성 완료`);

             }).catch((err) => {
               console.log(err);
               return;
             });

           }).catch((err) => {
             console.log(err);
             res.status(200).json({
               err: err
              });
             return;
           });
     }
     res.status(200).json({
        message: "room, room_members 각각 생성완료",
        //room: newRoom
      });
      return;
 
   }).catch((err) => {
     res.status(200).json({
       message: err
     });
     return;
   });
});

//방 입장 전 과정
router.get('/:userId', async function (req, res, next) {

  const User = req.params.userId;
  let RoomInfo = [];
  let room_members_in_db = await room_members.findAll({
      where : { user_id : User },
      // include: [
      //     { model: room, attributes: [] }//, required: false }
      // ],
      // order: [[room, 'updated_date', 'DESC']]
  })


  for (let room_member of room_members_in_db) {

    let room_other_members = await room_members.findAll({
      where : { room_id: room_member.room_id }
    })


    let member_list = [];
    for (let member of room_other_members ){
      member_name = await user.findByPk(member.user_id)
      member_list.push(member_name.name)
    }
    RoomInfo.push({id: room_member.room_id, name: room_member.room_name, memger: member_list})
  }

  //console.log(RoomInfo);
  res.status(200).send(RoomInfo);
  return;

});


//방 입장
router.get('/:userId/:roomId', async function (req, res, next) {
  //나중에 여기 auth 미들웨어 이용, token 값으로 사용자 정보 가져와서 방 입장
  const userID = await req.params.userId;
  const roomID = await req.params.roomId;

  //유저의 latest chat id 갱신해주는 부분
  await handleDb.updateLatestChat(userID, roomID);

  let roomInfo = await handleDb.readRoom(userID,roomID);


  try {
    res.status(200).send(roomInfo);
    return;

  } catch (err) {
    res.status(200).json({
      message: "enter room - server error."
    })
    return;
  }
});

module.exports = router;

