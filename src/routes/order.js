const router = require('express').Router();
const orderController = require('../controllers/OrderController');
router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrder);

module.exports = router;
