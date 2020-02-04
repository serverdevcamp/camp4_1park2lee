const express = require('express');
const router = express.Router();
const {
    user
} = require('../../models');
const util = require('../../modules/utils');
const passport = require('../../modules/passport');


var bkfd2Password = require('pbkdf2-password');
var hasher = bkfd2Password();


router.get('/', (req, res) => {

    res.status(200).json({
        failType: "none"
    });
    
});


router.post('/', async function (req, res, next) {
    initPassport();

    let flash = req.flash('fail');

    console.log(req.session);
    res.status(200).json({
        failType: (flash == null)? '': flash
    });

});

module.exports = router;