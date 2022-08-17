const orderModel = require('../models/Order');
const detailModel = require('../models/OrderDetail');
const { isUniqueArray } = require('../ulti/index');
class InstockController {
  async createEmptyOrder(req,res){
    if (!req.body.id_nguoidung)
      return res.json({
        status: 'Error',
        message: 'Missing required parameter(s)',
        body: req.body,
      });
    const { id_nguoidung, TinhTrang = 1, GhiChu = '' } = req.body;
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

      return res.json({
        status: 'OK',
      });
  }
  async createOrder(req, res) {
    if (!req.body.id_nguoidung || !req.body.products)
      return res.json({
        status: 'Error',
        message: 'Missing required parameter(s)',
        body: req.body,
      });
    const { id_nguoidung, TinhTrang = 1, GhiChu = '', products } = req.body;
    if (!Array.isArray(products))
      return res.json({
        status: 'Error',
        message: 'Field name products must be an array',
        products,
      });
    if (!isUniqueArray(products.map((product) => product.id_chitiet)))
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
    const orders = await orderModel.getOrdersByUserId(req.user.MaNguoiDung);
    if (orders instanceof Error)
      return res.json({
        status: 'Error',
        message: orders.message,
      });
    return res.json(orders);
  }

  async updateOrderById(req, res) {
    if (!req.body.TinhTrang)
      return res.json({
        status: 'Error',
        message: 'Missing required parameter(s)',
        body: req.body,
      });
    const { TinhTrang, GhiChu='' } = req.body;
    const updateResult = await orderModel.updateById(
      TinhTrang,
      GhiChu,
      req.params.id
    );
    if (updateResult instanceof Error)
      return res.json({
        status: 'Error',
        message: updateResult.message,
      });
    return res.json({
      status: 'OK',
    });
  }

  async deleteByOrderid(req, res) {
    const deleteDetailResult = await detailModel.deleteByOrderId(req.params.id);
    if (deleteDetailResult instanceof Error)
      return res.json({
        status: 'Error',
        message: deleteDetailResult.message,
      });
    const deleteOrderResult = await orderModel.deleteById(req.params.id);
    if (deleteOrderResult instanceof Error)
      return res.json({
        status: 'Error',
        message: deleteOrderResult.message,
      });
    return res.json({
      status: 'OK',
    });
  }
}

module.exports = new InstockController();
