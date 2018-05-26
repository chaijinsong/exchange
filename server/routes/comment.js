var express = require('express');
var router = express.Router();
var db = require('../utils/db');
var retDataFormat = require('../utils/retDataFormat');


router.post('/selectComment',function (req,res,next) {
    let pid = req.body.pid;
    let selectSql = `select * from comment,user where pid='${pid}' and comment.uid=user.uid`;
    db.query(selectSql,(err,result)=>{
        if(err){
            res.end(JSON.stringify(retDataFormat(err.message)))
        }
        res.end(JSON.stringify(retDataFormat(result)))
    })
})

router.post('/saveComment', function(req, res, next) {

    let pid = req.body.pid;
    let uid = req.body.uid;
    let content = req.body.comment;

    let addSql = `INSERT INTO comment(content,uid,pid) VALUES(?,?,?)`;
    let sqlParam = [content,uid,pid];

    new Promise((resolve,reject)=>{
        db.query(addSql,sqlParam,(err,result)=>{
            if(result.affectedRows > 0){
                resolve(pid);
            }
        })
    }).then(pid=>{

        //查找到评价信息，以及评价人的一些信息，关联查询
        let selectSql = `select * from comment,user where pid='${pid}' and comment.uid=user.uid`;
        db.query(selectSql,(err,result)=>{
            res.end(JSON.stringify(retDataFormat(result)))
        })

    }).catch(err=>{
        res.end(JSON.stringify(retDataFormat(err.message)))
    })

});

router.post('/selectMyCommented',function (req,res,next) {
    let start = req.body.start;
    let length = req.body.length;
    let uid = req.body.uid;

    //查询我评价过的商品
    // let selectSql = `select product.* from user_product,product where user_product.uid=${uid} and user_product.pid=product.p_id order by product.p_createTime desc limit ${start},${length}`;
    let selectSql = `select distinct product.p_id,product.* from product,comment where comment.uid=${uid} and comment.pid=product.p_id order by product.p_createTime desc limit ${start},${length}`;

    db.query(selectSql,function (err,result) {
        res.end(JSON.stringify(retDataFormat(result)))
    })
})

module.exports = router;
