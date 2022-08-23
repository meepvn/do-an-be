const pool = require('../configs/connectDB');

const queries = {
  insert:
    'insert into donhang (MaNguoiDung,NgayTao,TinhTrang,GhiChu) values (?,?,?,?)',
  getAllOrders:
    'select donhang.id,MaNguoiDung,HoTen,SDT,NgayTao,TinhTrang,GhiChu from donhang,nguoidung where donhang.MaNguoiDung = nguoidung.id order by id desc',
  getAllDetails:
    'select chitietdonhang.*,TenSP,Size,TenAnh from chitietdonhang,sanpham,chitietsanpham where chitietdonhang.MaChiTiet=chitietsanpham.id and chitietsanpham.MaSanPham=Sanpham.id order by chitietdonhang.id desc',
  getByUserId:
    'select donhang.id,HoTen,SDT,NgayTao,TinhTrang,GhiChu from donhang,nguoidung where donhang.MaNguoiDung = nguoidung.id and nguoidung.id = ?',
  updateById: 'update donhang set TinhTrang = ?, GhiChu = ? where id = ?',
  deleteById: 'delete from donhang where id = ?',
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
        const matchedDetails = details.filter(
          (detail) => detail.MaDonHang === order.id
        );
        const detailInfo = matchedDetails.map((detail) => {
          const { MaDonHang, ...info } = detail;
          info.ThanhTien =
            detail.DonGia * detail.SoLuong * (1 - detail.KhuyenMai / 100);
          return info;
        });
        order.TongTien = detailInfo.reduce(
          (result, current) => result + current.ThanhTien,
          0
        );
        return { ...order, ChiTiet: [...detailInfo] };
      });
      return ordersWithDetails;
    } catch (err) {
      return new Error(err);
    }
  }

  async getOrdersByUserId(id) {
    try {
      const allOrders = await this.getAllOrders();
      return allOrders.filter((order) => order.MaNguoiDung === id);
      const [orders] = await pool.execute(queries.getByUserId, [id]);
      const [details] = await pool.execute(queries.getAllDetails);
      const ordersWithDetails = orders.map((order) => {
        const detail = details.filter(
          (detail) => detail.MaDonHang === order.id
        );
        return { ...order, ChiTiet: [...detail] };
      });
      return ordersWithDetails;
    } catch (err) {
      return new Error(err);
    }
  }

  async updateById(TinhTrang, GhiChu, id) {
    try {
      const [result] = await pool.execute(queries.updateById, [
        TinhTrang,
        GhiChu,
        id,
      ]);
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
}

module.exports = new Order();
