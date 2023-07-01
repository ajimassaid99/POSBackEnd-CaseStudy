const router = require('express').Router();
const { police_check } = require('../../middleware');
const TagController = require('./controller');

router.post('/Tags',police_check('create','Tag'),TagController.createTag);

router.get('/Tags',TagController.getTag);

router.put('/Tags/:id',police_check('update','Tag'),TagController.updateTagById);


router.delete('/Tags/:id',police_check('delete','Tag'),TagController.deleteTagById);

module.exports = router;