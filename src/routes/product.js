const router = require('express').Router();
const productController = require('../controllers/ProductController.js');
// const { authenticateAdmin } = require('../middlewares/auth.js');
const handleUpload = require('../middlewares/multer');

router.post('/upload/:id', handleUpload, productController.uploadImage);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProductWithId);
router.post('/', handleUpload, productController.insertProduct);
router.get('/', productController.getAllProduct);
router.get('/type', productController.getAllProductType);
module.exports = router;
