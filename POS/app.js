var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors'); 
var {decodeToken} = require('./middleware');
var app = express();
var productRoute = require('./app/products/router');
var CategoryRoute = require('./app/category/router');
var TagRoute = require('./app/tag/router');
var AuthRoute = require('./app/auth/router');
var AddresRoute = require('./app/deleveryAddress/router');
var CartRoute = require('./app/cart/router');
var OrderRoute = require('./app/order/router');
var InvoiceRoute = require('./app/invoice/router');
var RatingRoute = require('./app/rating/router');
var PaymentRoute = require('./app/payment/router');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images/products', express.static(path.join(__dirname, 'public/images/products')));
app.use(decodeToken());

app.use('/api', AuthRoute);
app.use('/api', productRoute);
app.use('/api', TagRoute);
app.use('/api', CategoryRoute);
app.use('/api', AddresRoute);
app.use('/api', CartRoute);
app.use('/api', OrderRoute);
app.use('/api', InvoiceRoute);
app.use('/api', RatingRoute);
app.use('/api',PaymentRoute);

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
