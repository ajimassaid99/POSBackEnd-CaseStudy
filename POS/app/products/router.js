const router = require('express').Router();
const multer = require('multer');
const os = require('os');

const ProductController = require('./controller');

router.post('/products',multer({dest:os.tmpdir()}).single('image'),ProductController.storeProduct);

router.get('/products',ProductController.getProducts);

router.put('/products/:id',multer({dest:os.tmpdir()}).single('image'),ProductController.updateProductById);

router.get('/products/:id',ProductController.getProductById);

router.delete('/products/:id',ProductController.deleteProductById);

module.exports = router;