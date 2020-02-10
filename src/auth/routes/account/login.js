const express = require('express');
const router = express.Router();

const util = require('../../modules/utils');
const passport = require('passport');
const passportModule = require('../../modules/passport');


const redis = require('../../modules/redis');

passportModule(passport);


router.get('/', (req, res) => {
    if(req.isAuthenticated()){
        res.status(401).send('Unauthorized');
    }else{
        res.status(200).send('logged in');
    }
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
            return res.send("Logged in");
        })

    })(req, res, next);
    // req.user.save();
    console.log("user!" + JSON.stringify(req.user));
})
;

module.exports = router;