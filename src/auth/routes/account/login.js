const express = require('express');
const router = express.Router();
const {
    user
} = require('../../models');
const util = require('../../modules/utils');
const passport = require('../../modules/passport');


passport.initPassport();
passport.usePassport();


router.get('/', (req, res) => {
    res.status(200).json({
        failType: "none"
    });
});


router.post('/', async function (req, res, next) {

    console.log("login posted!");
    passport.authenticate(
        'local', req, res, next
    )
});

module.exports = router;