const router = require('express').Router();
const { police_check } = require('../../middleware');
const orderController = require('./controller');

router.post('/orders',
    orderController.store,
    police_check('create','Order')
);
router.get('/orders',orderController.getOrder,police_check('view','Order'));

module.exports = router;