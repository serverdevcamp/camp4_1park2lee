var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cron = require('node-cron')
var indexRouter = require('./routes/index');
var dbHandler = require('./module/handleDb');
//mysql 연동
var sequelize = require('./models').sequelize;
sequelize.sync();

var spellCheck = require('./module/spellCheck');
spellCheck.recvFormQueue();

var app = express();

// view engine setup
app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');
app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile);
app.engine('html', require('jade').renderFile);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


cron.schedule(' 1-59/10 * * * * *', function () {
  console.log('RUN CRON');
  dbHandler.calcUserRank();

});

module.exports = app;
