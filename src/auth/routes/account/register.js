const express = require('express');
const router = express.Router();
const util = require('../../modules/utils');

var bkfd2Password = require('pbkdf2-password');
var hasher = bkfd2Password();

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

    let isExist = await util.checkEmailExistance(form.email)
    if (isExist) {
        console.log(form.email + "is already exist");
        res.status(400).send("This email already exist!")
        return;
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
                    status: 0,
                    grade: 1,
                    salt: salt
                }).then((newUserRow) => {      
                    console.log("register success! " + newUserRow);
                    return res.send("registered successfully!"); ;
                })
            }
        })
    }
});

module.exports = router;