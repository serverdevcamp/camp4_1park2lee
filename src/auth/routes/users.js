const express = require('express');
const router = express.Router();

router.get('/',function(req, res, next) {
  let user =  req.user;
  console.log(req.session);


  res.send({user: user});
});



module.exports = router;
