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
            if(user.image_path === null){
                user.image_path = "http://localhost:3000/images/default_img.jpg"
            }
            res.send({user: user});
        });
    } else {
        res.send({user: undefined});
    }
});



module.exports = router;
