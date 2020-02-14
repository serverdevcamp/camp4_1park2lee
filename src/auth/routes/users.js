const express = require('express');
const router = express.Router();
const db = require('../models');
const fs = require('fs');

router.get('/', function (req, res) {
    if (req.user !== undefined) {
        console.log(req.session);
        db.user.findOne({
                attributes: ['id','name','nickname','score','profile_message','grade','status','email','myroom'],
                where: {id: req.user.id}
            }
        ).then((user) => {
            res.send({user: user});
        });
    } else {
        res.send({user: undefined});
    }
});

router.get('/image', function(req, res){
    if (req.user !== undefined) {
        console.log(req.session);
        db.user.findOne({
                attributes: ['image_path'],
                where: {id: req.user.id}
            }
        ).then((user) => {
            let image_path = '';

            if(user.image_path === null || user.image_path === ''){
                image_path = "uploads/images/default_img.jpg"
            }
            else {
                image_path = user.image_path;
            }

            console.log(image_path);
            let img = fs.readFile(image_path, function(err,data){
                if(err){
                    console.log(err);
                    res.send(err);
                }else {
                    let base64 = Buffer.from(data).toString('base64');
                    res.send(base64);
                }
            });
        }).catch((err)=>{
            console.log("db err!",err)
        });
    } else {
        res.send(null);
    }
});


module.exports = router;
