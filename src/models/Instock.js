const pool = require('../configs/connectDB');

const queries = {
  getAll:
    'select chitietsanpham.id,TenSP,Size,SoLuong,DonGia,KhuyenMai,TenAnh from chitietsanpham,sanpham where sanpham.id=chitietsanpham.MaSanPham',
  getByProductIdAndSize:
    'select * from chitietsanpham where MaSanPham= ? and Size = ?',
  insert: 'insert into chitietsanpham (MaSanPham,Size,SoLuong) values (?,?,?)',
  deleteByProductId: 'delete from chitietsanpham where MaSanPham= ?',
  deleteById: 'delete from chitietsanpham where id = ?',
  update: 'update chitietsanpham set SoLuong = ? where id = ?',
};

class Instock {
  async getAll() {
    try {
      const [instock] = await pool.execute(queries.getAll);
      return instock;
    } catch (error) {
      console.log(error);
      return new Error(error);
    }
  }
  async deleteByProductId(id) {
    try {
      const [result] = await pool.execute(queries.deleteByProductId, [id]);
      return result;
    } catch (error) {
      return new Error(error);
    }
  }
  async insert(id_sanpham, Size, SoLuong) {
    try {
      const [isSizeExist] = await pool.execute(queries.getByProductIdAndSize, [
        id_sanpham,
        Size,
      ]);
      if (isSizeExist.length > 0)
        return new Error(`Sản phẩm đã tồn tại size ${Size}`);
      const [result] = await pool.execute(queries.insert, [
        id_sanpham,
        Size,
        SoLuong,
      ]);
      return result;
    } catch (error) {
      return new Error(error);
    }
  }

  async deleteById(id) {
    try {
      const [result] = await pool.execute(queries.deleteById, [id]);
      return result;
    } catch (error) {
      return new Error(error);
    }
  }

  async updateInstock(id, SoLuong) {
    try {
      const [result] = await pool.execute(queries.update, [SoLuong, id]);
      return result;
    } catch (error) {
      return new Error(error);
    }
  }
}

module.exports = new Instock();
