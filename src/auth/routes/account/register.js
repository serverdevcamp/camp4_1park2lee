const express = require('express');
const router = express.Router();
const util = require('../../modules/utils');
const config = require('../../../hunmin-config');

const bkfd2Password = require('pbkdf2-password');
const hasher = bkfd2Password();

const mail = require('../../modules/mail');

const {
    user
} = require('../../models');
// let userTable = require('../../models/user');
// let passport = require('passport');


router.get('/', (req, res) => {
    if (req.isAuthenticated() !== undefined) {
        res.status(200).json({
            loggedin: true
        });
    }
    else{
        res.status()
    }

});


router.post('/', async function (req, res, next) {

    const form = {
        "email": req.body.email,
        "name": req.body.name,
        "password": req.body.password
    };

    let isExist = await util.checkEmailExistance(form.email);
    if (isExist) {
        console.log(form.email + "is already exist");
        return res.status(400).send("이미 존재하는 이메일 입니다!");
    } else {
        hasher({
            password: form.password
        }, async (err, pass, salt, hash) => {
            if (err) {
                console.log("hasing error! : " + err);
                return res.status(400).send("please retry!")
            } else {
                user.create({
                    email: form.email,
                    name: form.name,
                    pwd: hash,
                    status: false,
                    grade: 3,
                    nickname: form.name,
                    salt: salt,
                    image_path: `http://${config.AUTH_URL}/images/default_img.jpg`
                }).then((newUserRow) => {
                    mail.sendEmail(form.email, 'confirm');
                    console.log("register success! " + newUserRow);
                    return res.send("registered successfully!");
                })
            }
        })
    }
});

module.exports = router;
