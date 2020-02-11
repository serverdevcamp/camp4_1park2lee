const express = require('express');
const router = express.Router();
const db = require('../../models');
const utils = require('../../modules/utils');


router.get('/', async function (req, res) {
    let user = req.user.id;
    var query = 'SELECT user.id, user.email, user.name, user.nickname, user.photo, user.score, friend.status, user.grade  \n' +
        'FROM friend LEFT JOIN user \n' +
        'ON user.id = friend.friend \n' +
        'WHERE friend.user = :user;';
    var values = {
        user: user
    };
    db.sequelize.query(query, {replacements: values})
        .spread(function (results, metadata) {
            console.log(metadata, typeof (metadata));
            res.status(200).send(metadata);
        }, function (err) {
            console.log(err);
            res.status(400).send(err);
        });

});


router.post('/add', async function (req, res) {
    let user = req.user.id;

    const form = {
        "email": req.body.email
    };

    let isUserExist = await utils.checkEmailExistance(form.email);
    if (isUserExist) {
        db.user.findOne({
            where: {email: form.email}
        }).then(async (userRow) => {
            console.log("id!!" + userRow);
            let isFriendExist = await utils.checkFriendExistance(userRow.id);
            if (isFriendExist) {
                res.send(`already friend or send friend request to ${userRow.name}`)
            } else {
                db.friend.create({
                    user: user,
                    friend: userRow.id,
                    status: false
                });
                res.send(`send friend request to ${userRow.name}`)
            }
        })
    } else {
        res.send(`${form.email} not exist`);
    }
});

router.get('/request', function (req, res) {
    let user = req.user.id;
    var query = 'SELECT user.id, user.email, user.name, user.nickname, user.photo, user.score \n' +
        'FROM friend LEFT JOIN user \n' +
        'ON user.id = friend.user \n' +
        'WHERE friend.friend = :user and friend.status = 0 ;';
    var values = {
        user: user
    };

    db.sequelize.query(query, {replacements: values})
        .spread(function (results, metadata) {
            console.log(metadata, typeof (metadata))
            res.status(200).send(metadata);
        }, function (err) {
            console.log(err);
            res.status(400).send(err);
        });
});

router.post('/request/reply', async function (req, res) {
    let user = req.user.id;
    let status = req.body.status;
    let id = req.body.id;

    if (status === '0') {
        db.friend.destroy({
            where: {
                user: id,
                friend: user,
                status: false
            }
        })
    } else {
        console.log("accept!");
        let isFriendExist = await utils.checkFriendExistance(user,id);
        if (!isFriendExist) {
            db.friend.create({
                user: user,
                friend: id,
                status: true
            });
            db.friend.update(
                {status: true},
                {
                    where: {
                        user: id,
                        friend: user
                    }
                });
            res.send("Accept friend")
        } else {
            res.send('Already accepted or canceled friend ')
        }
    }
});


module.exports = router;