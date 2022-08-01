const pool = require('../configs/connectDB');

const queries = {
  insert:
    'insert into donhang (id_nguoidung,NgayTao,TinhTrang,GhiChu) values (?,?,?,?)',
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
}

module.exports = new Order();
