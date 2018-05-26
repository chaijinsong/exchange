var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var index = require('./routes/index');
var users = require('./routes/users');
var product = require('./routes/product');
var login = require('./routes/login');
var register = require('./routes/register');
var upload = require('./routes/upload');
var comment = require('./routes/comment');
var message = require('./routes/message');
var category = require('./routes/category');
var collect = require('./routes/collect');
var backUser = require('./routes/backUser');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

//管理静态资源
app.use(express.static('public'));

app.all('*', function (req, res, next) {

    let origin = req.get('Origin');
    res.header("Access-Control-Allow-Origin",origin);
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Credentials","true");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    next();

})

//商品接口
app.use('/product',product);
//用户接口
app.use('/users', users);
//登录接口
app.use('/login',login);
//注册接口
app.use('/register',register);
//上传接口
app.use('/upload',upload);
//评论接口
app.use('/comment',comment);
//新评论提示信息接口
app.use('/message',message);
//类别接口
app.use('/category',category);

//收藏接口
app.use('/collect',collect);

//后台用户接口
app.use('/api/backUser',backUser);

//根目录接口
app.use('/', index);























// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
