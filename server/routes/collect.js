var express = require('express');
var router = express.Router();
var db = require('../utils/db');
var retDataFormat = require('../utils/retDataFormat');


//取消收藏
router.get('/cancelCollect',function (req,res,next) {

    let uid = req.query.uid;
    let pid = req.query.pid;

    let selectSql = `select * from collection where uid=${uid} and pid=${pid}`;
    db.query(selectSql,function (err,result) {
        if(err){
            res.end(JSON.stringify(retDataFormat(err)));
        }
        //1.先查表，看之前是否存在这个记录
        if(result.length > 0){

            let deleteSql = `delete from collection where uid=${uid} and pid=${pid}`;
            db.query(deleteSql,function (err,result) {
                if(err){
                    res.end(JSON.stringify(retDataFormat(err)));
                }else{
                    res.end(JSON.stringify(retDataFormat('成功取消收藏')))
                }
            })

        }else{
            res.end(JSON.stringify(retDataFormat('成功取消收藏')))
        }
    })
})

//添加收藏
router.get('/addCollect',function (req,res,next) {
    let uid = req.query.uid;
    let pid = req.query.pid;

    let selectSql = `select * from collection where uid=${uid} and pid=${pid}`;
    db.query(selectSql,function (err,result) {
        if(err){
            res.end(JSON.stringify(retDataFormat(err)));
        }
        //1.先查表，看之前是否存在这个记录
        if(result.length > 0){
            res.end(JSON.stringify(retDataFormat('收藏成功')))
        }else{
            let addSql = `insert into collection (uid,pid) values(?,?)`;
            let sqlParam = [uid,pid];
            db.query(addSql,sqlParam,function (err,result) {
                if(err){
                    res.end(JSON.stringify(retDataFormat(err)));
                }else{
                    res.end(JSON.stringify(retDataFormat('收藏成功')))
                }
            })
        }
    })

})

//查询该商品是否收藏过
router.get('/queryCollect',function (req,res,next) {
    let uid = req.query.uid;
    let pid = req.query.pid;
    let selectSql = `select * from collection where uid=${uid} and pid=${pid}`;
    db.query(selectSql,function (err,result) {
        if(err){
            res.end(JSON.stringify(retDataFormat(err)));
        }
        if(result.length > 0){
            res.end(JSON.stringify(retDataFormat(true)))
        }else{
            res.end(JSON.stringify(retDataFormat(false)))
        }

    })
})

//查询该用户收藏过的所有商品
router.post('/selectMyCollect',function (req,res,next) {
    let uid = req.body.uid;
    let start = req.body.start;
    let length = req.body.length;

    let selectSql = `select product.* from product,collection where product.p_id=collection.pid and collection.uid=${uid}`;
    db.query(selectSql,function (err,result) {
        if(err) {
            res.end(JSON.stringify(retDataFormat(err)))
        }
        res.end(JSON.stringify(retDataFormat(result)))
    })

})


module.exports = router;
