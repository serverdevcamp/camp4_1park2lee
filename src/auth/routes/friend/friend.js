const express = require('express');
const router = express.Router();
const {
    user, friend
} = require('../../models');
const db = require('../../models');
const model = require
const redis = require('../../modules/redis');
const utils = require('../../modules/utils');
// //
// async function getFriends(friendRows){
//     let friends = [''];
//     await friendRows.forEach(async friendRow => {
//         let friend = await user.findOne({
//             attributes: ['id', 'email', 'name', 'nickname', 'photo', 'score', 'status'],
//             where: {
//                 id: friendRow.friend
//             },
//             raw: true
//         });
//         console.log(friend);
//         friends = await friends.push(friend);
//     });
//
//     return await friends;
// };


router.get('/', async function (req, res, next) {
    let USER = 3;

    var query = 'SELECT user.id, user.email, user.name, user.nickname, user.photo, user.score, friend.status  \n' +
        'FROM friend LEFT JOIN user \n' +
        'ON user.id = friend.friend \n' +
        'WHERE friend.user = :user;';
    var values = {
        user: USER
    };

    db.sequelize.query(query, {replacements: values})
        .spread(function (results, metadata) {
            console.log(metadata, typeof (metadata))
            res.status(200).send(metadata);
        }, function (err) {
            console.log(err);
            res.status(400).send(err);
        });

    // user.findAll({
    //     attributes: ['id', 'email', 'name', 'nickname', 'photo', 'score', 'status'],
    //     include: [{
    //         model: friend,
    //         where: `user = ${USER}`
    //     }],
    //     raw: true
    // }).then(friends => {
    //     console.log(friends);
    // })
    // var friends = [];
    // friend.findAll(
    //     {attributes: ['friend']}
    //     , {where: {user: USER}})
    //     .then(async friendRows => {
    //         friends = await getFriends(friendRows);
    //         console.log(friends);
    //         res.send(friends);
    //     });

});


router.post('/add', async function (req, res, next) {
    let USER = 3;

    const form = {
        "email": req.body.email
    }

    let isUserExist = await utils.checkEmailExistance(form.email);
    if (isUserExist) {
        user.findOne({
            where: {email: form.email}
        }).then(async (userRow) => {
            console.log("id!!" + userRow);
            let isFriendExist = await utils.checkFriendExistance(userRow.id);
            if (isFriendExist) {
                res.send(`already friend or send friend request to ${userRow.name}`)
            } else {
                friend.create({
                    user: USER,
                    friend: userRow.id,
                    status: false
                })
                res.send(`send friend request to ${userRow.name}`)
            }
        })
    } else {
        res.send(`${form.email} not exist`);
    }
});

router.get('/request', function (req, res, next) {
    let USER = 7;
    var query = 'SELECT user.id, user.email, user.name, user.nickname, user.photo, user.score \n' +
        'FROM friend LEFT JOIN user \n' +
        'ON user.id = friend.user \n' +
        'WHERE friend.friend = :user ;';
    var values = {
        user: USER
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

router.get('/reply/:id/:status', async function (req, res, next) {
    let USER = 6;
    let status = req.params.status;
    let id = req.params.id;
    if (status === '0') {
        friend.destroy({
            where: {
                user: req.params.id,
                friend: USER,
                status: false
            }
        })
    } else {
        let isFriendExist = await utils.checkFriendExistance(id);
        if (isFriendExist) {
            friend.create({
                user: USER,
                friend: req.params.id,
                status: true
            });
            friend.update(
                {status: true},
                {
                    where: {
                        user: req.params.id,
                        friend: USER
                    }
                })
            res.send("Accept friend")
        } else {
            res.send('Already accepted or canceled friend ')
        }
    }
});


module.exports = router;