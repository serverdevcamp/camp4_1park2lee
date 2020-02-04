let express = require('express');
let router = express.Router();
let path = require("path");

const usersRouter = require('./users');
const previewRouter = require('./preview');
const registerRouter = require('./account/register.js');
const loginRouter = require('./account/login.js')

/* GET home page. */

router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../../public', 'index.html'));
});

router.use('/auth/users', usersRouter);
router.use('/preview', previewRouter);

router.use('/auth/account/register', registerRouter);
router.use('/auth/account/login', loginRouter);

module.exports = router;