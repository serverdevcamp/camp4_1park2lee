const express = require('express');
const router = express.Router();
const db = require('../models');
const fs = require('fs');

router.get('/', function (req, res) {
    if (req.user !== undefined) {
        console.log(req.session);
        db.user.findOne({
                attributes: ['id','name','nickname','score','profile_message','grade','image_path','status','email'],
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
            let image_path = user.image_path;
            res.send(image_path);
        }).catch((err)=>{
            console.log("db err!",err)
        });
    } else {
        res.send(null);
    }
});


module.exports = router;
