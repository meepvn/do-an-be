const pool = require('../configs/connectDB');

const queries = {
  insert:
    'insert into chitietdonhang (MaDonHang,TenSP,Size,SoLuong,DonGia,KhuyenMai) values (?,?,?,?,?,?)',
  getProductDetailById:
    'select * from sanpham,chitietsanpham where sanpham.id = chitietsanpham.MaSanPham and chitietsanpham.id = ?',
  deleteByOrderId: 'delete from chitietdonhang where MaDonHang = ?',
};

class OrderDetail {
  async insertDetail(id_donhang, id_chitiet, SoLuong) {
    try {
      const [[product]] = await pool.execute(queries.getProductDetailById, [
        id_chitiet,
      ]);
      if (!product) return new Error('Sản phẩm không tồn tại');
      const { TenSP, DonGia, KhuyenMai, Size } = product;
      const [result] = await pool.execute(queries.insert, [
        id_donhang,
        TenSP,
        Size,
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
}

module.exports = new OrderDetail();
