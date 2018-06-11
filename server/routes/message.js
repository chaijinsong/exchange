var express = require('express');
var router = express.Router();
var db = require('../utils/db');
var retDataFormat = require('../utils/retDataFormat');


router.post('/myproductAndMessage',function (req,res,next) {
    let uid = req.body.uid;
    /*
    * 1.先查自己的所有商品，
    * 2.查商品下hasRead=0的评论
    * */

    let selectSql = `select * from product,user_product,comment where user_product.uid=${uid} and user_product.pid=product.p_id and comment.pid=product.p_id and comment.hasRead=0`
    db.query(selectSql,function (err,result) {
        res.end(JSON.stringify(retDataFormat(result)))
    })

    /*
        当前登录用户 == 发表商品的用户，才能接受到信息。
        1.先根据当前用户，找到评论的商品id
        2.根据评论的商品id，找到发布商品的人
        3.判断如果登录用户id === 发布商品人id，则返回所有数据
    */
    // let selectSql2 = `select * from comment where comment.uid='${uid}' and comment.hasRead=0`;
    // db.query(selectSql2,function (err,result) {
    //     let pid = result[0].pid; //获取商品id
    //     let selectSql3 = `select * from user_product where user_product.pid=${pid}`;
    //     db.query(selectSql3,function (err,result) {
    //         let publicUid = result[0].uid;
    //         if(uid === publicUid){
    //             let selectSql = `select * from product where product.p_id=${pid}`
    //             db.query(selectSql,function (err,result) {
    //                 res.end(JSON.stringify(retDataFormat(result)))
    //             })
    //         }else{
    //             res.end(JSON.stringify(retDataFormat([])))
    //         }
    //     })
    // })



    //1.查找评论没有查看的商品信息，并且将评论和商品信息都获取到
    // let selectSql = `select * from comment,product,user,user_product where comment.uid='${uid}' and comment.hasRead=0 and comment.pid=product.p_id and user_product.p`;
    // db.query(selectSql,function(err,result){
    //     res.end(JSON.stringify(retDataFormat(result)));
    // })
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
