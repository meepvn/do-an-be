const instockModel = require('../models/Instock.js');

class InstockController {
  async getAllInstock(req, res) {
    const instock = await instockModel.getAll();
    if (instock instanceof Error) {
      return res.status(500).json({
        status: 'Error',
        message: instock?.message,
      });
    }
    res.status(200).json(instock);
  }
  async insertInstock(req, res) {
    if (!req.body.id_sanpham || !req.body.Size || !req.body.SoLuong)
      return res.status(200).json({
        status: 'Error',
        message: 'Missing required parameter(s)',
        body: req.body,
      });
    const { id_sanpham, Size, SoLuong } = req.body;
    const result = await instockModel.insert(id_sanpham, Size, SoLuong);
    if (result instanceof Error)
      return res.status(200).json({
        status: 'Error',
        message: result?.message,
      });
    return res.status(200).json({
      status: 'OK',
      message: result,
    });
  }
  async deleteInstock(req, res) {
    const result = await instockModel.deleteById(req.params.id);
    if (result instanceof Error)
      return res.status(200).json({
        status: 'Error',
        message: result?.message,
      });
    return res.status(200).json({
      status: 'OK',
      result,
    });
  }
  async updateInstock(req, res) {
    if (!req.body.SoLuong)
      return res.status(200).json({
        status: 'Error',
        message: 'Missing required parameter(s)',
        body: req.body,
      });
    const { SoLuong } = req.body;
    const result = await instockModel.updateInstock(req.params.id, SoLuong);
    if (result instanceof Error) return res.status(200).json(result.message);
    return res.status(200).json({
      status: 'OK',
      message: result,
    });
  }
}

module.exports = new InstockController();
