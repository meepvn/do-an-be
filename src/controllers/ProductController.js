const productModel = require('../models/Product.js');

class ProductController {
  async getAllProduct(req, res) {
    const products = await productModel.getAll();
    if (products instanceof Error) {
      console.log(products);
      return res.status(500).json('Cannot connect to DB');
    }
    res.status(200).json(products);
  }
}

module.exports = new ProductController();
