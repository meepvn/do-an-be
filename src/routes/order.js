const router = require('express').Router();
const orderController = require('../controllers/OrderController');
router.post('/', orderController.createOrder);

module.exports = router;
