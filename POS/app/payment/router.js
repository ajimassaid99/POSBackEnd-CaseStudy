const router = require('express').Router();
const paymentController = require('./controller');

router.post('/midtrans/notification', paymentController.handleMidtransNotification);
module.exports = router;