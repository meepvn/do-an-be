const instockModel = require('../models/Instock.js');

class InstockController {
  async getAllInstock(req, res) {
    const instock = await instockModel.getAll();
    if (instock instanceof Error) {
      console.log(instock);
      return res.status(500).json('Cannot connect to DB');
    }
    res.status(200).json(instock);
  }
  async insertInstock(req, res) {
    if (!req.body.id_sanpham || !req.body.Size || !req.body.SoLuong)
      return res.status(200).json('Missing required parameter(s)');
    const { id_sanpham, Size, SoLuong } = req.body;
    const result = await instockModel.insert(id_sanpham, Size, SoLuong);
    if (result instanceof Error) return res.status(200).json(result.message);
    return res.status(200).json('OK');
  }
  async deleteInstock(req, res) {
    const result = await instockModel.deleteById(req.params.id);
    if (result instanceof Error) return res.status(200).json('Error !!!');
    return res.status(200).json('OK');
  }
  async updateInstock(req, res) {
    if (!req.body.SoLuong)
      return res.status(200).json('Missing required parameter(s)');
    const { SoLuong } = req.body;
    const result = await instockModel.updateInstock(req.params.id, SoLuong);
    if (result instanceof Error) return res.status(200).json(result.message);
    return res.status(200).json('OK');
  }
}

module.exports = new InstockController();
