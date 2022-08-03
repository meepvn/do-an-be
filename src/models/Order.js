const pool = require('../configs/connectDB');

const queries = {
  insert:
    'insert into donhang (id_nguoidung,NgayTao,TinhTrang,GhiChu) values (?,?,?,?)',
  getAllOrders:
    'select donhang.id,HoTen,SDT,NgayTao,TinhTrang,GhiChu from donhang,nguoidung where donhang.id_nguoidung = nguoidung.id',
  getAllDetails:
    'select chitietdonhang.id,chitietdonhang.id_donhang,TenSP,Size,DonGia,KhuyenMai,chitietdonhang.SoLuong from chitietdonhang,sanpham,soluongsanpham where sanpham.id = soluongsanpham.id_sanpham and chitietdonhang.id_soluong = soluongsanpham.id',
};

class Order {
  async insertOrder(id_nguoidung, NgayTao, TinhTrang, GhiChu) {
    try {
      const [result] = await pool.execute(queries.insert, [
        id_nguoidung,
        NgayTao,
        TinhTrang,
        GhiChu,
      ]);
      return result;
    } catch (err) {
      return new Error(err);
    }
  }
  async getAllOrders() {
    try {
      const [orders] = await pool.execute(queries.getAllOrders);
      const [details] = await pool.execute(queries.getAllDetails);
      const ordersWithDetails = orders.map((order) => {
        const detail = details.filter(
          (detail) => detail.id_donhang === order.id
        );
        return { ...order, ChiTiet: [...detail] };
      });
      return ordersWithDetails;
    } catch (err) {
      return new Error(err);
    }
  }
}

module.exports = new Order();
