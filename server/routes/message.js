var express = require('express');
var router = express.Router();
var db = require('../utils/db');
var retDataFormat = require('../utils/retDataFormat');


router.post('/myproductAndMessage',function (req,res,next) {
    let uid = req.body.uid;

    //1.查找评论没有查看的商品信息，并且将评论和商品信息都获取到
    let selectSql = `select * from comment,product,user where comment.uid='${uid}' and comment.hasRead=0 and comment.pid=product.p_id and comment.uid=user.uid`;
    db.query(selectSql,function(err,result){
        res.end(JSON.stringify(retDataFormat(result)));
    })
})

router.post('/changeHasRead',function (req,res,next) {
    let pid = req.body.pid;
    let cid = req.body.cid;
    let updataSql = `update comment set hasRead=1 where pid=${pid} and cid=${cid}`;
    db.query(updataSql,function (err,result) {
        if(err){
            res.end(JSON.stringify(retDataFormat(err.message)))
            return;
        }
        res.end(JSON.stringify(retDataFormat([])))
    })
})


module.exports = router;
