const router = require('express').Router();
const { police_check } = require('../../middleware');
const DeleveryAddressController = require('./controller');

router.post('/DeleveryAddress',police_check('create','DeliveryAddress'),DeleveryAddressController.createDeleveryAddress);

router.get('/DeleveryAddress',police_check('view','DeliveryAddress'),DeleveryAddressController.getdeleveryAddress);

router.put('/DeleveryAddress/:id',police_check('update','DeliveryAddress'),DeleveryAddressController.updateDeleveryAddressById);

router.delete('/DeleveryAddress/:id',police_check('delete','DeliveryAddress'),DeleveryAddressController.deleteDeleveryAddressById);

module.exports = router;