const pool = require('../configs/connectDB');
const queries = {
  insert: 'insert into nguoidung (HoTen,SDT,DiaChi) values (?,?,?)',
  getAll:
    'select nguoidung.*,taikhoan.TenTaiKhoan,taikhoan.Email from nguoidung,taikhoan where nguoidung.id = taikhoan.MaNguoiDung',
  getUserByPhoneNumber: 'select * from nguoidung where SDT = ?',
  getUserById:
    'select nguoidung.*,taikhoan.TenTaiKhoan,taikhoan.Email from nguoidung,taikhoan where nguoidung.id = taikhoan.MaNguoiDung and nguoidung.id = ?',
  deleteById: 'delete from nguoidung where id = ?',
  updateById:
    'update nguoidung set HoTen = ?, SDT = ?, DiaChi = ? where id = ?',
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
      const [result] = await pool.execute(queries.deleteById, [id]);
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

  async updateById(HoTen, SDT, DiaChi, id) {
    try {
      const [phonenumbers] = await pool.execute(
        'select SDT from nguoidung where id != ?',
        [id]
      );
      if (phonenumbers.map((item) => item.SDT).includes(SDT))
        return new Error('Số điện thoại đã được sử dụng');
      const [result] = await pool.execute(queries.updateById, [
        HoTen,
        SDT,
        DiaChi,
        id,
      ]);
      return result;
    } catch (err) {
      return new Error(err);
    }
  }
}

module.exports = new User();
