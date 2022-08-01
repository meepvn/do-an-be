const router = require('express').Router();
const productRouter = require('./product.js');
const instockRouter = require('./instock.js');
const userRouter = require('./user.js');
const orderRouter = require('./order');
router.get('/', (req, res) => {
  res.json({
    message: 'API OK',
    product: '/api/product',
    intock: '/api/instock',
    user: '/api/user',
  });
});
router.use('/product', productRouter);
router.use('/instock', instockRouter);
router.use('/user', userRouter);
router.use('/order', orderRouter);
module.exports = router;
