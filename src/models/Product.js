const pool = require('../configs/connectDB');

const queries = {
  getAll: 'select * from sanpham',
  getById: 'select * from sanpham where id = ?',
  getByName: 'select * from sanpham where TenSP = ?',
  deleteById: 'delete from sanpham where id = ?',
  insert:
    'insert into sanpham (TenSP,Loai,GioiTinh,DonGia,KhuyenMai) values (?,?,?,?,?)',
  update:
    'update sanpham set TenSP = ?, Loai = ?, GioiTinh = ?, DonGia = ?, KhuyenMai = ? where id = ?',
  addImageName: 'update sanpham set TenAnh = ? where id = ?',
  getAllProductType: 'SELECT distinct Loai FROM `sanpham`',
  getAllInstock: 'select * from chitietsanpham',
};

class Product {
  async getAll() {
    try {
      const [products] = await pool.execute(queries.getAll);
      const [instocks] = await pool.execute(queries.getAllInstock);
      const productsInfo = products.map((product) => {
        const instock = instocks.filter(
          (instock) => instock.MaSanPham === product.id
        );
        return { ...product, ChiTiet: [...instock] };
      });
      const types = await this.getAllProductType();
      return { products: productsInfo, types };
    } catch (error) {
      console.log(error);
      return new Error(error);
    }
  }
  async getById(id) {
    try {
      const [product] = await pool.execute(queries.getById, [id]);
      return product[0];
    } catch (error) {
      return new Error(error);
    }
  }
  async deleteWithId(id) {
    try {
      const [result] = await pool.execute(queries.deleteById, [id]);
      return result;
    } catch (error) {
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
  async updateImageName(id, imageName) {
    try {
      const result = await pool.execute(queries.addImageName, [imageName, id]);
      return result;
    } catch (err) {
      return new Error(err);
    }
  }
  async getAllProductType() {
    try {
      const [types] = await pool.execute(queries.getAllProductType);
      return types.map((type) => type.Loai);
    } catch (err) {
      return new Error(err);
    }
  }
}

module.exports = new Product();
