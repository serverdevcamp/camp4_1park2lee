const express = require('express');
const router = express.Router();

const util = require('../../modules/utils');
const passport = require('passport');
const passportModule = require('../../modules/passport');


const redis = require('../../modules/redis');

passportModule(passport);

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
};


router.get('/', (req, res) => {
    res.status(200).json({
        failType: "none",
        user: "123"+JSON.stringify(req.session.key)
    });
});


router.post('/', (req, res, next) => {

// console.log("login posted!");
    passport.authenticate('local', (err, user, info) => {
        console.log(user);

        if (err) {
            console.log("err", err);
            return next(err);
        }

        if (!user) {
            console.log("cannot log in" + info);
            return res.status(400).send([user, "Cannot log in", info])
        }

        req.login(user, err => {
            console.log("logged in");
            req.session.key = req.user.id;
            redis.set('user', req.user.id);
            console.log(req.session.key);
            console.log(req.session.user);
            return res.send("Logged in");
        })

    })(req, res, next);
    // req.user.save();
    console.log("user!" + JSON.stringify(req.user));
})
;

module.exports = router;