const productModel = require('../models/Product.js');
const instockModel = require('../models/Instock.js');
const { reName, deleteImage } = require('../ulti/');

const checkReqBodyData = (req) => {
  if (
    !req.body.TenSP ||
    !req.body.DonGia ||
    !req.body.GioiTinh ||
    !req.body.Loai
  )
    return false;
  if (!req.body.KhuyenMai && req.body.KhuyenMai !== 0) return false;
  return true;
};

class ProductController {
  async getAllProduct(req, res) {
    const products = await productModel.getAll();
    if (products instanceof Error)
      return res.status(500).json({
        status: 'Error',
        message: result?.message,
      });
    res.status(200).json(products);
  }
  async getAllProductType(req, res) {
    const types = await productModel.getAllProductType();
    if (types instanceof Error)
      return res.status(500).json({
        status: 'Error',
        message: result?.message,
      });
    res.status(200).json(types);
  }

  async deleteProductWithId(req, res) {
    const product = await productModel.getById(req.params.id);
    const result = await productModel.deleteWithId(req.params.id);
    if (result instanceof Error)
      return res.status(500).json({
        status: 'Error',
        message: result?.message,
      });

    const instockResult = await instockModel.deleteByProductId(req.params.id);

    if (instockResult instanceof Error)
      return res.status(500).json({
        status: 'Error',
        message: result?.message,
      });
    res.status(200).json({
      status: 'OK',
    });
  }
  async insertProduct(req, res) {
    if (!checkReqBodyData(req)) {
      deleteImage(req.file.filename);
      return res.json({
        status: 'Error',
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
    if (result instanceof Error) {
      deleteImage(req.file.filename);
      return res.status(400).json({
        status: 'Error',
        message: result.message,
      });
    }
    const fileName = reName(req.file, result.insertId);
    await productModel.updateImageName(result.insertId, fileName);
    return res.json({
      status: `OK`,
      insertId: result.insertId,
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
    if (result instanceof Error)
      return res.status(400).json({
        status: 'Error',
        message: result.message,
      });
    return res.json({
      status: 'OK',
      message: result,
    });
  }
  async uploadImage(req, res) {
    const product = await productModel.getById(req.params.id);
    if (product.TenAnh) deleteImage(product.TenAnh);
    const fileName = reName(req.file, req.params.id);
    await productModel.updateImageName(req.params.id, fileName);
    return res.json({
      status: `OK`,
    });
  }
}
module.exports = new ProductController();
