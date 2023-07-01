const router = require('express').Router();
const multer = require('multer');
const os = require('os');

const ProductController = require('./controller');
const { police_check } = require('../../middleware');

router.post('/products',
            multer({dest:os.tmpdir()}).single('image'),
            police_check('create','Product'),
            ProductController.storeProduct);

router.get('/products',ProductController.getProducts);

router.put('/products/:id',
            multer({dest:os.tmpdir()}).single('image'),
            police_check('update','Product'),
            ProductController.updateProductById);

router.get('/products/:id',ProductController.getProductById);

router.delete('/products/:id',
                ProductController.deleteProductById,
                police_check('delete','Product'),);

module.exports = router;