var express = require('express');
var router = express.Router();

var retDataFormat = require('../utils/retDataFormat');
var db = require('../utils/db');

/*
    查询所有分类的接口
 */
router.get('/getCategoryList', function(req, res, next) {

    let selectSql = `select * from category`
    db.query(selectSql,function (err,result) {
        res.end(JSON.stringify(retDataFormat(result)))
    })

});

//获取该类别下的所有商品
router.get('/getBelongToCategoryProductList',function (req,res,next) {
    let cid = req.query.cid;
    let selectSql = `select product.* from category_product,product where category_product.cid=${cid} and category_product.pid=product.p_id`;
    db.query(selectSql,function (err,result) {
        if(err){
            res.end(JSON.stringify(retDataFormat(err.message)))
            return;
        }
        res.end(JSON.stringify(retDataFormat(result)))
    })

})

module.exports = router;
