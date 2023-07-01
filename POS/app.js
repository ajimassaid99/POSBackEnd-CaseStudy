var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors'); 
var productRoute = require('./app/products/router');
var CategoryRoute = require('./app/category/router');
var TagRoute = require('./app/tag/router');
var AuthRoute = require('./app/auth/router');
var AddresRoute = require('./app/deleveryAddress/router');
var CartRoute = require('./app/cart/router');
var OrderRoute = require('./app/order/router');
var InvoiceRoute = require('./app/invoice/router');
var {decodeToken} = require('./middleware');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(decodeToken());
//Auth
app.use('/api',AuthRoute);
//products
app.use('/api',productRoute);
//Tag
app.use('/api',TagRoute);
//category
app.use('/api',CategoryRoute);
//Address
app.use('/api',AddresRoute);
//Address
app.use('/api',CartRoute);
//Address
app.use('/api',OrderRoute);
//Address
app.use('/api',InvoiceRoute);

//home
app.use('/',function (req,res){
 res.render('index',{
  title: "Massaid's Store"
 })
});

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

module.exports = app;
