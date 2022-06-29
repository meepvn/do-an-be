const router = require('express').Router();
const productController = require('../controllers/ProductController.js');

router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProductWithId);
router.get('/', productController.getAllProduct);
router.post('/', productController.insertProduct);
module.exports = router;
