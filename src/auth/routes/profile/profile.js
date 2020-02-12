const express = require('express');
const router = express.Router();
const db = require('../../models');


router.post('/edit', function(req,res){
    if(req.user !== undefined) {
        const form = req.body;
        console.log(JSON.stringify(form));
        db.user.update(
            {
                profile_message: form.profile_message,
                nickname : form.nickname,
            },
            {
                where:{
                    id: req.user.id
                }
            }
        );
        res.status(200).send("success!");
    }else{
        res.status(401).send("not exist user");
    }

});

module.exports = router;