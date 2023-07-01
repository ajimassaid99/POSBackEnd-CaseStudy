const router = require('express').Router();
const { police_check } = require('../../middleware');
const DeleveryAddressController = require('./controller');

router.post('/DeleveryAddress',police_check('create','DeleveryAddress'),DeleveryAddressController.createDeleveryAddress);

router.get('/DeleveryAddress',police_check('view','DeleveryAddress'),DeleveryAddressController.getdeleveryAddress);

router.put('/DeleveryAddress/:id',police_check('update','DeleveryAddress'),DeleveryAddressController.updateDeleveryAddressById);

router.delete('/DeleveryAddress/:id',police_check('delete','DeleveryAddress'),DeleveryAddressController.deleteDeleveryAddressById);

module.exports = router;