const express = require('express');
const router = express.Router();

const utils = require('../../modules/utils');
const redis = require('../../modules/redis');

const jwt = require("jsonwebtoken");
const jwtConfig = require('../../config/jwt').jwt;

const db = require('../../models');

const redisClient = redis.getRedisClient();

router.get('/:token', async function(req, res){
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

module.exports = router;