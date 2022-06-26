const router = require('express').Router();
const productRouter = require('./product.js');

router.get('/', (req, res) => {
  res.json({
    message: 'API OK',
    product: '/api/product',
  });
});
router.use('/product', productRouter);

module.exports = router;
