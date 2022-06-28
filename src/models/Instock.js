const pool = require('../configs/connectDB');

const queries = {
  getAll: 'select * from soluongsanpham',
};

class Product {
  async getAll() {
    try {
      const [instock] = await pool.execute(queries.getAll);
      return instock;
    } catch (error) {
      console.log(error);
      return new Error(error);
    }
  }
}

module.exports = new Product();
