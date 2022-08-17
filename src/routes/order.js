const router = require('express').Router();
const orderController = require('../controllers/OrderController');
const { authenticateUser } = require('../middlewares/auth');

router.put('/:id', orderController.updateOrderById);
router.delete('/:id', orderController.deleteByOrderid);
router.post('/admin', orderController.createEmptyOrder);
router.post('/', orderController.createOrder);
router.get('/personal', authenticateUser, orderController.getOrdersByUserId);
router.get('/', orderController.getAllOrder);
module.exports = router;
