const router = require('express').Router();
const { police_check } = require('../../middleware');
const CartController = require('./controller');

router.get('/Cart',police_check('view','Cart'),CartController.getCart);

router.put('/Cart',police_check('update','Cart'),CartController.updateCart);

module.exports = router;