const pool = require('../configs/connectDB');
const bcrypt = require('bcryptjs');
const queries = {
  getAll: 'select * from taikhoan',
  insert: 'insert into taikhoan values(?,?,?,?,?)',
  getByUserNameAndEmail:
    'select * from taikhoan where TenTaiKhoan = ? or Email = ?',
  getByEmail: 'select * from taikhoan where Email = ?',
};

class Account {
  async insert(id, TaiKhoan, MatKhau, Email, Quyen) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPwd = await bcrypt.hash(MatKhau, salt);
      const [result] = await pool.execute(queries.insert, [
        id,
        TaiKhoan,
        hashedPwd,
        Email,
        Quyen,
      ]);
      return result;
    } catch (err) {
      return new Error(err);
    }
  }
  async findByUsernameOrEmail(TenTaiKhoan, Email) {
    try {
      const [result] = await pool.execute(queries.getByUserNameAndEmail, [
        TenTaiKhoan,
        Email,
      ]);
      return result.length;
    } catch (err) {
      return new Error(err);
    }
  }

  async findByEmail(Email) {
    try {
      const [result] = await pool.execute(queries.getByEmail, [Email]);
      return result.length;
    } catch (err) {
      return new Error(err);
    }
  }

  async getAccountByUserNameOrEmail(TenTaiKhoan, Email) {
    try {
      const [result] = await pool.execute(queries.getByUserNameAndEmail, [
        TenTaiKhoan,
        Email,
      ]);
      return result[0];
    } catch (err) {
      return new Error(err);
    }
  }
}

module.exports = new Account();
