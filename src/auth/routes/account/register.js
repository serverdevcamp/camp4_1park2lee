const express = require('express');
const router = express.Router();
const util = require('../../modules/utils');

var bkfd2Password = require('pbkdf2-password');
var hasher = bkfd2Password();

const { user } = require('../../models');
// let userTable = require('../../models/user');
// let passport = require('passport');


router.get('/', (req, res) => {
    // if (req.user !== undefined) {
    res.status(200).json({
        loggedin: true
    });
    // } else {
    //     res.json({
    //         loggedin: false
    //     });
    // }
});


router.post('/', async function (req, res, next) {

    const form = {
        "email": req.body.email,
        "name": req.body.name,
        "password": req.body.password
    }

    let isUnique = await util.checkEmailExistance(form.email)
    if (isUnique) {
        hasher({
            password: form.password
        }, async (err, pass, salt, hash) => {
            //generate password
            if (err) {
                console.log("hasing error! : " + err);
            } else {
                user.create({
                    email: form.email,
                    name: form.name,
                    pwd: hash,
                    status: 0,
                    grade: 1,
                    salt: salt
                }).then((newUserRow) => {
                    console.log("register success! " + newUserRow);
                    return;
                })
            }
        })
    } else {
        console.log(form.email + "is already exist");
        return;
    }
});

module.exports = router;