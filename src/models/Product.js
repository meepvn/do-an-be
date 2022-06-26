const pool = require('../configs/connectDB');

const queries = {
  getAll: 'select * from sanpham',
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
}

module.exports = new Product();
