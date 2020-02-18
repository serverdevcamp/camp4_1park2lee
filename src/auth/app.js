let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let bodyParser = require('body-parser');
let flash = require('connect-flash');
let app = express();

let passport = require('passport');
let localStrategy = require('passport-local').Strategy;

let redis = require('redis');
let session = require('express-session');
let redisStore = require('connect-redis')(session);
// let redisConfig = require('./config/redis.json');

let config = require('../hunmin-config');

let redisConfig = require(path.join( config.CONFIG_PATH, "redis.json"))[config.NODE_ENV];
let redisClient = redis.createClient(redisConfig);

let sequelize = require('./models').sequelize;
sequelize.sync();

let indexRouter = require('./routes/index');
let passportModule = require('./modules/passport');


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
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', indexRouter);
let LOGIN = require('./routes/account/login');
app.use('/login', LOGIN);

app.use(function (req, res) {
    res.locals.login = req.isAuthenticated();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;