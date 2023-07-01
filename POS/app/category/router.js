const router = require('express').Router();
const { police_check } = require('../../middleware');
const categoryController = require('./controller');

router.post('/categorys',police_check('create','Category'),categoryController.createCategory);

router.get('/categorys',categoryController.getCategories);

router.put('/categorys/:id',police_check('update','Category'),categoryController.updateCategoryById);


router.delete('/categorys/:id',police_check('delete','Category'),categoryController.deleteCategoryById);

module.exports = router;