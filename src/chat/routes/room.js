var express = require('express');
var router = express.Router();

var room = require('../model/room');
var chat = require('../model/chat');


//Create room
router.post ('/', async function(req, res, next) {
  const { roomName, userId } = req.body; //방 이름과 만든 유저정보
  console.log(roomName, userId)
  
  //1. 파라미터체크
  if(!roomName || !userId ){
    res.status(200).json({
        message: "필수 정보를 입력하세요."
    });
    return;
  }

  //2.방 이름 중복 체크
  try{
    const room_in_db = await room.findOne({ name : roomName })
    if(room_in_db){
        res.status(200).json({
            message:"이미 존재하는 방 이름 입니다."
        })
        return;
    }
  }catch (err) { 
    if(err){
        res.status(200).json({
            message:"check duplicate - server error."
        })
        return;
    }
  }
  
  //3. 방 생성
  var roomModel = new room ()
    roomModel.name = roomName;
    roomModel.member.push( userId );
    roomModel.countRead.push( 0 );
    roomModel.countMember = 1;
    roomModel.save()
        .then((newRoom) => {

            console.log("Create 완료")
            res.status(200).json({
                message: "Create success",
                data:{
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

//Read room
router.get ('/:roomName/:userId', async function(req, res, next) {
  const userId = req.params.userId;
  const roomName = req.params.roomName;
  try{
    const room_in_db = await room.findOne({ name : roomName })
    if(room_in_db){
        res.render('tempRoom.html', { room : room_in_db })
        return;
    }
  }catch (err) { 
    if(err){
        res.status(200).json({
            message:"find room - server error."
        })
        return;
    }
  }

});

module.exports = router;
