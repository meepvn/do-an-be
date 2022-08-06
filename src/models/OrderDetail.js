const pool = require('../configs/connectDB');

const queries = {
  insert:
    'insert into chitietdonhang (MaDonHang,MaChiTiet,SoLuong) values (?,?,?)',
  getInstockIdsByOrderId:
    'select MaChiTiet from chitietdonhang where MaDonHang = ?',
};

class OrderDetail {
  async insertDetail(id_donhang, id_soluong, SoLuong) {
    try {
      const instockIds = await this.getInstockIdsByOrderId(id_donhang);
      if (instockIds.includes(id_soluong))
        return new Error('Sản phẩm đã tồn tại trong đơn hàng');
      const [result] = await pool.execute(queries.insert, [
        id_donhang,
        id_soluong,
        SoLuong,
      ]);
      return result;
    } catch (err) {
      console.log('ERROR!', err);
      return new Error(err);
    }
  }
  async getInstockIdsByOrderId(id_donhang) {
    try {
      const [result] = await pool.execute(queries.getInstockIdsByOrderId, [
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
