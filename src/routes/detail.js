const router = require('express').Router();
const orderDetailController = require('../controllers/OrderDetailController')

router.put('/:id',orderDetailController.updateById);
router.delete('/:id',orderDetailController.deleteById)
router.post('/',orderDetailController.insertDetail);

module.exports = router;