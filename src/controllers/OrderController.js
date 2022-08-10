const orderModel = require('../models/Order');
const detailModel = require('../models/OrderDetail');
const { isUniqueArray } = require('../ulti/index');
class InstockController {
  async createOrder(req, res) {
    if (!req.body.id_nguoidung || !req.body.products)
      return res.json({
        status: 'Error',
        message: 'Missing required parameter(s)',
        body: req.body,
      });
    const {
      id_nguoidung,
      TinhTrang = 'Chờ xác nhận',
      GhiChu = '',
      products,
    } = req.body;
    if (!Array.isArray(products))
      return res.json({
        status: 'Error',
        message: 'Field name products must be an array',
        products,
      });
    if (!isUniqueArray(products.map((product) => product.id_soluong)))
      return res.json({
        status: 'Error',
        message: 'Duplicate product ids',
      });
    const orderResult = await orderModel.insertOrder(
      id_nguoidung,
      new Date(Date.now()),
      TinhTrang,
      GhiChu
    );

    if (orderResult instanceof Error)
      return res.json({
        status: 'Error',
        message: orderResult?.message,
      });
    products.forEach(async (product) => {
      await detailModel.insertDetail(
        orderResult.insertId,
        product.id_chitiet,
        product.SoLuong
      );
    });
    return res.json({
      status: 'OK',
    });
  }
  async getAllOrder(req, res) {
    const orders = await orderModel.getAllOrders();
    if (orders instanceof Error)
      return res.json({
        status: 'Error',
        message: orders.message,
      });
    return res.json(orders);
  }

  async getOrdersByUserId(req, res) {
    const orders = await orderModel.getOrdersById(req.user.MaNguoiDung);
    if (orders instanceof Error)
      return res.json({
        status: 'Error',
        message: orders.message,
      });
    return res.json(orders);
  }
}

module.exports = new InstockController();
