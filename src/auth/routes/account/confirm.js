const express = require('express');
const router = express.Router();
const path = require('path');
const config = require('../../../hunmin-config');

const utils = require('../../modules/utils');
const redis = require('../../modules/redis');
const mail = require('../../modules/mail');

const jwt = require("jsonwebtoken");
const jwtConfig = require(path.join( config.CONFIG_PATH, "jwt.json"))[config.NODE_ENV].jwt;
const db = require('../../models');

const redisClient = redis.getRedisClient();

router.get('/:token', async function(req, res){
    console.log("token:",req.params.token);
    try {
        var decoded = jwt.verify(req.params.token, jwtConfig);
        if (decoded) {
            let isExist = await utils.checkEmailExistance(decoded.user);
            redisClient.get(decoded.user, function(err, value){
                if (isExist && value === req.params.token) {
                    db.user.update(
                        {status: 1},
                        {where: {email: decoded.user}}
                        )
                        .then(() => {
                            redis.del(decoded.user);
                            res.status(200).send("confirm email!");
                        })
                        .catch((err) => {
                            res.status(400).send(err);
                        });
                }else{
                    res.status(400).send("expired!");
                }
            });
        } else {
            res.status(400).send(err);
        }
    } catch (err) {
        console.log(err);
    }
});


router.post('/', async function(req,res){
    let email = req.body.email;

    let isExist = await utils.checkEmailExistance(email);
    if(isExist){
        mail.sendEmail(email, 'confirm');
        return res.send("resend confirmation email");
    }
    else{
        return res.status(400).send(`${email} is not exist`);
    }
});

module.exports = router;
