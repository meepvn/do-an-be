const detailModel = require('../models/OrderDetail')

class OrderDetailController{
    async insertDetail(req,res){
        const {id_donhang,id_chitiet,SoLuong} = req.body;
        if(!id_chitiet || !SoLuong || !id_donhang) return res.json({
            status:'Error',
            message:'Missing required parameter(s)'
        })
        const insertResult = await detailModel.insertDetail(id_donhang,id_chitiet,SoLuong);
        if(insertResult instanceof Error) return res.json({
            status:'Error',
            message:insertResult.message
        })
        return res.json({
            status:'OK'
        })
    }

    async deleteById(req,res){
        const deleteResult = await detailModel.deleteById(req.params.id);
        if(deleteResult instanceof Error) return res.json({
            status:'Error',
            message:deleteResult.message
        })
        return res.json({
            status:'OK'
        })
    }

    async updateById(req,res){
        const {SoLuong} = req.body;
        if(!SoLuong) return res.json({
            status:'Error',
            message:'Missing required parameters'
        })
        const updateResult = await detailModel.updateById(req.params.id);
        if(updateResult instanceof Error) return res.json({
            status:'Error',
            message:updateResult.message
        })
        return res.json({
            status:'OK'
        })
    }
}

module.exports = new OrderDetailController();