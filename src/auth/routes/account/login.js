const express = require('express');
const router = express.Router();
const config = require('../../../hunmin-config');
const passport = require('passport');
const passportModule = require('../../modules/passport');


passportModule(passport);


router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(401).send('Unauthorized');
    } else {
        res.status(200).send('logged in');
    }
});


router.post('/', (req, res, next) => {

    passport.authenticate('local', (err, user, info) => {
        console.log(user);

        if (err) {
            console.log("err", err);
            return next(err);
        }

        if (!user) {
            console.log("cannot log in" + info);
            return res.status(400).send([user, "Cannot log in", JSON.stringify(info)])
        }

        req.login(user, err => {
            return res.send("Logged in");
        })

    })(req, res, next);

    console.log("user!" + JSON.stringify(req.user));
});

router.get('/oauth/kakao', passport.authenticate('kakao-login'));


router.get('/oauth', (req, res, next) => {
    console.log("oauth login");
    passport.authenticate('kakao-login', (err, user, info) => {
        if (err) {
            console.log("err", err);
            return next(err);
        }

        if (!user) {
            console.log("cannot log in" + info);
            return res.status(400).send([user, "Cannot log in", JSON.stringify(info)])
        }

        req.login(user, err => {
            // return res.send("KaKao Logged in");
            if(config.NODE_ENV==="development")
                res.redirect('http://localhost:8080');
            else
                res.redirect('http://hunmintalk.tk');
        })

    })(req, res, next);
});


module.exports = router;