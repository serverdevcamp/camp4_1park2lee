const express = require('express');
const router = express.Router();
const db = require('../../models');
const config = require('../../../hunmin-config.js');
const multer = require('multer');

const set_multerS3 = require('../../modules/multer_s3');
const set_multer = require('../../modules/multer');
const utils = require('../../modules/utils');


// let upload = set_multerS3(multer);

router.post('/edit', function (req, res) {
    if (req.user !== undefined) {
        const form = req.body;
        console.log(JSON.stringify(form));
        db.user.update(
            {
                profile_message: form.profile_message,
                nickname: form.nickname,

            },
            {
                where: {
                    id: req.user.id
                }
            }
        );
        res.status(200).send("success!");
    } else {
        res.status(401).send("not exist user");
    }

});


router.post('/image/upload', config.NODE_ENV === "development" ? set_multer(multer).single('file') : set_multerS3(multer).single('file'), async function (req, res) {
        console.log('image upload start');
        if (req.user !== undefined) {
            console.log(req.user);
            console.log(req.file.path);
            let fileType = await utils.getFileType(req.file.originalname);
            db.user.update(
                {
                    //image_path: `http://${config.AUTH_URL}/images/profile_${req.user.id}${fileType}`
                    //https://humin.s3-us-west-2.amazonaws.com/
                    image_path: `profile_${req.user.id}${fileType}`
                },
                {
                    where: {
                        id: req.user.id
                    }
                })
                .then((result) => {
                    console.log(result);
                    res.status(200).send("success!");
                }).catch(err => {
                res.status(400).send("fail");
            })
        }
    });


module.exports = router;
