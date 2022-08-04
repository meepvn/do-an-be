const pool = require('../configs/connectDB');

const queries = {
  getAll:
    'select soluongsanpham.id,TenSP,Size,SoLuong,DonGia,KhuyenMai from soluongsanpham,sanpham where sanpham.id=soluongsanpham.id_sanpham',
  getByProductIdAndSize:
    'select * from soluongsanpham where id_sanpham= ? and Size = ?',
  insert: 'insert into soluongsanpham (id_sanpham,Size,SoLuong) values (?,?,?)',
  deleteByProductId: 'delete from soluongsanpham where id_sanpham= ?',
  deleteById: 'delete from soluongsanpham where id = ?',
  update: 'update soluongsanpham set SoLuong = ? where id = ?',
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
