const express = require('express');
const router = express.Router();
const passport = require('../../modules/passport');


router.get('/', (req, res) => {

    req.session.destroy(function(err){
        if(err){
            console.log(err);
            res.status(400).json(err);
        }else{
            res.status(200).json("logout successfully");
        }
    })
});

module.exports = router;