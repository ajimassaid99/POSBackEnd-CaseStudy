const router = require('express').Router();

const TagController = require('./controller');

router.post('/Tags',TagController.createTag);

router.get('/Tags',TagController.getTag);

router.put('/Tags/:id',TagController.updateTagById);


router.delete('/Tags/:id',TagController.deleteTagById);

module.exports = router;