const router = require('express').Router();
const productRouter = require('./product.js');
const instockRouter = require('./instock.js');

router.get('/', (req, res) => {
  res.json({
    message: 'API OK',
    product: '/api/product',
    intock: '/api/instock'
  });
});
router.use('/product', productRouter);
router.use('/instock',instockRouter);

module.exports = router;
