const express = require('express');
const router = express.Router();
const db = require('../../models');

const multer = require('multer');
const set_multer = require('../../modules/multer');

let upload = set_multer(multer);

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


router.post('/image/upload', upload.single('file'),function (req, res) {
    if (req.user !== undefined) {
        db.user.update(
            {
                image_path: req.file.path
            },
            {
                where: {
                    id: req.user.id
                }
            })
            .then(() => {
                res.status(200).send("success!");

            }).catch(err => {
            res.status(400).send("fail");
        })
    }
});


module.exports = router;