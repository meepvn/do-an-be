const pool = require('../configs/connectDB');

const queries = {
  getAll: 'select * from sanpham',
  getByName: 'select * from sanpham where TenSP = ?',
  deleteById: 'delete from sanpham where id = ?',
  insert:
    'insert into sanpham (TenSP,Loai,GioiTinh,DonGia,KhuyenMai) values (?,?,?,?,?)',
  update:
    'update sanpham set TenSP = ?, Loai = ?, GioiTinh = ?, DonGia = ?, KhuyenMai = ? where id = ?',
};

class Product {
  async getAll() {
    try {
      const [products] = await pool.execute(queries.getAll);
      return products;
    } catch (error) {
      console.log(error);
      return new Error(error);
    }
  }
  async deleteWithId(id) {
    try {
      const [result] = await pool.execute(queries.deleteById, [id]);
      return result;
    } catch (error) {
      console.log(error);
      return new Error(error);
    }
  }
  async insertProduct(TenSP, Loai, GioiTinh, DonGia, KhuyenMai) {
    try {
      const [isProductNameExist] = await pool.execute(queries.getByName, [
        TenSP,
      ]);
      if (isProductNameExist.length > 0)
        return new Error('Tên sản phẩm đã tồn tại');
      return 'Test';
      const [result] = await pool.execute(queries.insert, [
        TenSP,
        Loai,
        GioiTinh,
        DonGia,
        KhuyenMai,
      ]);
      return result;
    } catch (error) {
      return new Error(error);
    }
  }
  async updateProduct(id, TenSP, Loai, GioiTinh, DonGia, KhuyenMai) {
    try {
      let [productNames] = await pool.execute(
        'select TenSP from sanpham where id != ?',
        [id]
      );
      productNames = productNames.map((item) => item.TenSP);
      if (productNames.includes(TenSP))
        return new Error(`Tên sản phẩm '${TenSP}' đã tồn tại`);
      const [result] = await pool.execute(queries.update, [
        TenSP,
        Loai,
        GioiTinh,
        DonGia,
        KhuyenMai,
        id,
      ]);
      return result;
    } catch (error) {
      return new Error(error);
    }
  }
}

module.exports = new Product();
