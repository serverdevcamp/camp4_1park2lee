const express = require('express');
const router = express.Router();

router.get('/',function(req, res, next) {

  let user =  req.session.user;

  console.log(req.session.key);

  res.send({user: user});
});



module.exports = router;
