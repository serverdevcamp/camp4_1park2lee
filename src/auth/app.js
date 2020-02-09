var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var app = express();

var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var redis = require('redis');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var redisConfig = require('./config/redis.json');
var redisClient = redis.createClient(redisConfig);

var sequelize = require('./models').sequelize;
sequelize.sync();

var indexRouter = require('./routes/index');
var passportModule = require('./modules/passport');
//
app.use(session({
    secret: 'secret_key',
    store: new redisStore({
        host: redisConfig.host,
        port: redisConfig.port,
        client: redisClient,
        ttl: 260
    }),
    saveUninitialized: false,
    resave: false,
}));

//passport setup
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passportModule(passport);

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', indexRouter);
let LOGIN = require('./routes/account/login');
app.use('/login', LOGIN);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});





module.exports = app;