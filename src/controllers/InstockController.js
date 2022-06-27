const instockModel = require('../models/Instock.js');

class InstockController{
    async getAllInstock(req, res) {
        const instock = await instockModel.getAll();
        if (instock instanceof Error) {
          console.log(instock);
          return res.status(500).json('Cannot connect to DB');
        }
        res.status(200).json(instock);
      }
}

module.exports = new InstockController();