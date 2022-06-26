const router = require('express').Router();
const productController = require('../controllers/ProductController.js');
router.get('/', productController.getAllProduct);

module.exports = router;
