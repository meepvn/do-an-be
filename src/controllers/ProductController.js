const productModel = require('../models/Product.js');
const instockModel = require('../models/Instock.js');

const checkReqBodyData = (req) => {
  if (
    !req.body.TenSP ||
    !req.body.KhuyenMai ||
    !req.body.DonGia ||
    !req.body.GioiTinh ||
    !req.body.Loai
  )
    return false;
  return true;
};

class ProductController {
  async getAllProduct(req, res) {
    const products = await productModel.getAll();
    if (products instanceof Error) return res.status(500).json('Error!!!');
    res.status(200).json(products);
  }
  async deleteProductWithId(req, res) {
    const result = await productModel.deleteWithId(req.params.id);
    if (result instanceof Error) return res.status(500).json('Error!!!');

    const instockResult = await instockModel.deleteByProductId(req.params.id);

    if (instockResult instanceof Error) return res.status(500).json('Error!!!');
    res.status(200).json('OK');
  }
  async insertProduct(req, res) {
    if (!checkReqBodyData(req)) {
      return res.json({
        message: 'Missing required parameter(s)',
        body: req.body,
      });
    }
    const { TenSP, KhuyenMai, DonGia, GioiTinh, Loai } = req.body;
    const result = await productModel.insertProduct(
      TenSP,
      Loai,
      GioiTinh,
      DonGia,
      KhuyenMai
    );
    if (result instanceof Error) return res.status(200).json(result.message);
    return res.json({
      message: 'OK',
      result,
    });
  }

  async updateProduct(req, res) {
    if (!checkReqBodyData(req)) {
      return res.json({
        message: 'Missing required parameter(s)',
      });
    }
    const { TenSP, KhuyenMai, DonGia, GioiTinh, Loai } = req.body;
    const result = await productModel.updateProduct(
      req.params.id,
      TenSP,
      Loai,
      GioiTinh,
      DonGia,
      KhuyenMai
    );
    if (result instanceof Error) return res.status(200).json(result.message);
    return res.json('OK');
  }
}

module.exports = new ProductController();
