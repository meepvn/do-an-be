const pool = require('../configs/connectDB');
const queries = {
  insert: 'insert into nguoidung (HoTen,SDT,DiaChi) values (?,?,?)',
  getAll:
    'select nguoidung.*,taikhoan.TenTaiKhoan,taikhoan.Email from nguoidung,taikhoan where nguoidung.id = taikhoan.MaNguoiDung',
  getUserByPhoneNumber: 'select * from nguoidung where SDT = ?',
  getUserById: 'select * from nguoidung where id = ?',
  deleteById: 'delete from nguoidung where id = ?',
};

class User {
  async insert(HoTen, SDT, DiaChi) {
    try {
      const [result] = await pool.execute(queries.insert, [HoTen, SDT, DiaChi]);
      return result;
    } catch (err) {
      return new Error(err);
    }
  }
  async getAll() {
    try {
      const [result] = await pool.execute(queries.getAll);
      return result;
    } catch (err) {
      return new Error(err);
    }
  }
  async getUserById(id) {
    try {
      const [result] = await pool.execute(queries.getUserById, [id]);
      return result[0];
    } catch (err) {
      return new Error(err);
    }
  }
  async deleteById(id) {
    try {
      cosnt[result] = await pool.execute(queries.deleteById, id);
      return result;
    } catch (err) {
      return new Error(err);
    }
  }
  async findUserByPhoneNumber(SDT) {
    try {
      const [result] = await pool.execute(queries.getUserByPhoneNumber, [SDT]);
      return result.length;
    } catch (err) {
      return new Error(err);
    }
  }
}

module.exports = new User();
