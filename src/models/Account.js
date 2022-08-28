const pool = require('../configs/connectDB');
const bcrypt = require('bcryptjs');
const queries = {
  getAll: 'select * from taikhoan order by MaNguoiDung desc',
  insert: 'insert into taikhoan values(?,?,?,?,?,?)',
  getByUserNameAndEmail:
    'select * from taikhoan where TenTaiKhoan = ? or Email = ?',
  getByEmail: 'select * from taikhoan where Email = ?',
  deleteByUserId: 'delete from taikhoan where MaNguoiDung = ?',
  getById: 'select * from taikhoan where MaNguoiDung = ?',
  updateById:
    'update taikhoan set TenTaiKhoan = ?, Email = ?, Quyen = ?, TrangThai = ? where MaNguoiDung = ?',
  updateEmailById: 'update taikhoan set Email = ? where MaNguoiDung = ?',
  updatePasswordById: 'update taikhoan set MatKhau = ? where MaNguoiDung = ?',
};

class Account {
  async insert(id, TaiKhoan, MatKhau, Email, Quyen, TrangThai) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPwd = await bcrypt.hash(MatKhau, salt);
      const [result] = await pool.execute(queries.insert, [
        id,
        TaiKhoan,
        hashedPwd,
        Email,
        Quyen,
        TrangThai,
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
      return result.length > 0;
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

  async deleteById(id) {
    try {
      const [result] = await pool.execute(queries.deleteByUserId, [id]);
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
  async getById(id) {
    try {
      const [result] = await pool.execute(queries.getById, [id]);
      return result[0];
    } catch (err) {
      return new Error(err);
    }
  }
  async updateById(TenTaiKhoan, Email, Quyen, TrangThai, id) {
    try {
      const [checkExist] = await pool.execute(
        'select * from taikhoan where (TenTaiKhoan = ? or Email = ?) and MaNguoiDung != ?',
        [TenTaiKhoan, Email, id]
      );
      if (checkExist.length > 0)
        return new Error('Tên tài khoản hoặc email đã tồn tại');

      const [result] = await pool.execute(queries.updateById, [
        TenTaiKhoan,
        Email,
        Quyen,
        TrangThai,
        id,
      ]);
      return result;
    } catch (err) {
      return new Error(err);
    }
  }

  async updatePersonal(Email, MatKhau, id = null) {
    try {
      const [checkExist] = await pool.execute(
        'select * from taikhoan where Email = ? and MaNguoidung != ?',
        [Email, id]
      );
      if (checkExist.length > 0) return new Error('Email này đã tồn tại');
      let result = null;
      if (Email)
        [result] = await pool.execute(queries.updateEmailById, [Email, id]);
      if (MatKhau) {
        const salt = await bcrypt.genSalt(10);
        const hashedPwd = await bcrypt.hash(MatKhau, salt);
        [result] = await pool.execute(queries.updatePasswordById, [
          hashedPwd,
          id,
        ]);
      }
      return result;
    } catch (err) {
      return new Error(err);
    }
  }

  async updatePasswordById(MatKhau, id) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPwd = await bcrypt.hash(MatKhau, salt);
      const [result] = await pool.execute(queries.updatePasswordById, [
        hashedPwd,
        id,
      ]);
      return result;
    } catch (err) {
      return new Error(err);
    }
  }
}

module.exports = new Account();
