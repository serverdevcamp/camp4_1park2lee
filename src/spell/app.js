var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var cron = require('node-cron');

var amqp = require('./modules/rabbitmq');

var indexRouter = require('./routes/index');
var spellRouter = require('./routes/spell');

var app = express();
// var redis = require('./modules/redis');
var mysql = require('./modules/mysql');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/spell', spellRouter);
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(function (req, res, next) {
  next(createError(404));
});


cron.schedule(' 15 * * * * *', function () {
  //Ranking 1 - 3 Words
  mysql.calcWordRank(3);
});

amqp.queueStart();

app.use(function (err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;