const router = require('express').Router();

const categoryController = require('./controller');

router.post('/categorys',categoryController.createCategory);

router.get('/categorys',categoryController.getCategories);

router.put('/categorys/:id',categoryController.updateCategoryById);


router.delete('/categorys/:id',categoryController.deleteCategoryById);

module.exports = router;