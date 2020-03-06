let express = require('express');
let router = express.Router();
let path = require("path");

const usersRouter = require('./users');
const previewRouter = require('./preview');

const registerRouter = require('./account/register.js');
const loginRouter = require('./account/login.js');
const logoutRouter = require('./account/logout.js');
const confirmRouter = require('./account/confirm.js');

const friendRouter = require('./friend/friend.js');
const profileRouter = require('./profile/profile.js');

/* GET home page. */

router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../../static/vue', 'index.html'));
});

router.use('/auth/user', usersRouter);
router.use('/preview', previewRouter);

router.use('/auth/account/logout', logoutRouter);
router.use('/auth/account/register', registerRouter);
router.use('/auth/account/login', loginRouter);
router.use('/auth/account/confirm',confirmRouter);

router.use('/auth/friend', friendRouter);

router.use('/auth/profile', profileRouter);

module.exports = router;