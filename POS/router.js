var express = require('express');
var router = express.Router();

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

router.use('/api', AuthRoute);
router.use('/api', productRoute);
router.use('/api', TagRoute);
router.use('/api', CategoryRoute);
router.use('/api', AddresRoute);
router.use('/api', CartRoute);
router.use('/api', OrderRoute);
router.use('/api', InvoiceRoute);
router.use('/api', RatingRoute);
router.use('/api',PaymentRoute);

module.exports = router;
