const pool = require('../configs/connectDB');

const queries = {
  insert:
    'insert into chitietdonhang (id_donhang,id_sanpham,SoLuong) values (?,?,?)',
  getProductIdsByOrder:
    'select id_sanpham from chitietdonhang where id_donhang = ?',
};

class OrderDetail {
  async insertDetail(id_donhang, id_sanpham, SoLuong) {
    try {
      const productIds = await this.getProductIdsByOrder(id_donhang);
      if (productIds.includes(id_sanpham))
        return new Error('Sản phẩm đã tồn tại trong đơn hàng');
      const [result] = pool.execute(queries.insert, [
        id_donhang,
        id_sanpham,
        SoLuong,
      ]);
      return result;
    } catch (err) {
      return new Error(err);
    }
  }
  async getProductIdsByOrder(id_donhang) {
    try {
      const [result] = await pool.execute(queries.getProductIdsByOrder, [
        id_donhang,
      ]);
      const productIds = result.map((product) => product.id_sanpham);
      return productIds;
    } catch (err) {
      return new Error(err);
    }
  }
}

module.exports = new OrderDetail();
