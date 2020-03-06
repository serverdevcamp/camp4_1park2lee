const express = require('express');
const router = express.Router();
const db = require('../models');
const fs = require('fs');

router.get('/', function (req, res) {
    if (req.user !== undefined) {
        db.user.findOne({
                attributes: ['id','name','nickname','score','profile_message','grade','image_path','status','email','myroom'],
                where: {id: req.user.id}
            }
        ).then((user) => {
            if(user.image_path === null){
                user.image_path = "default_img.jpg"
            }
            res.send({user: user});
        });
    } else {
        res.send({user: undefined});
    }
});



module.exports = router;
