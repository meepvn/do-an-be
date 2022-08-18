const pool = require('../configs/connectDB');

const queries = {
  insert:
    'insert into chitietdonhang (MaDonHang,MaChiTiet,SoLuong,DonGia,KhuyenMai) values (?,?,?,?,?)',
  getProductDetailById:
    'select * from sanpham,chitietsanpham where sanpham.id = chitietsanpham.MaSanPham and chitietsanpham.id = ?',
  deleteByOrderId: 'delete from chitietdonhang where MaDonHang = ?',
  deleteById:'delete from chitietdonhang where id = ?',
  updateById:'update chitietdonhang set SoLuong = ? where id = ?',
  getDetailsByOrderId:'select MaChiTiet from chitietdonhang where MaDonHang = ?'
};

class OrderDetail {
  async insertDetail(id_donhang, id_chitiet, SoLuong) {
    try {
      const [[product]] = await pool.execute(queries.getProductDetailById, [
        id_chitiet,
      ]);
      if (!product) return new Error('Sản phẩm không tồn tại');
      let [instockIds] = await pool.execute(queries.getDetailsByOrderId,[id_donhang]);
      instockIds = instockIds.map(instock=>instock.MaChiTiet);
      if(instockIds.includes(id_chitiet)) return new Error('Đơn hàng đã tồn tại sản phẩm này');
      const { DonGia, KhuyenMai } = product;
      const [result] = await pool.execute(queries.insert, [
        id_donhang,
        id_chitiet,
        SoLuong,
        DonGia,
        KhuyenMai,
      ]);
      return result;
    } catch (err) {
      console.log('ERROR!', err);
      return new Error(err);
    }
  }

  async deleteByOrderId(id) {
    try {
      const [result] = await pool.execute(queries.deleteByOrderId, [id]);
      return result;
    } catch (err) {
      return new Error(err);
    }
  }

  async deleteById(id) {
    try {
      const [result] = await pool.execute(queries.deleteById, [id]);
      return result;
    } catch (err) {
      return new Error(err);
    }
  }

  async updateById(SoLuong,id) {
    try {
      const [result] = await pool.execute(queries.updateById, [SoLuong,id]);
      return result;
    } catch (err) {
      return new Error(err);
    }
  }
}

module.exports = new OrderDetail();
