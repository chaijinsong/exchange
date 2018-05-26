var express = require('express');
var router = express.Router();
var db = require('../utils/db');
var retDataFormat = require('../utils/retDataFormat');

/* 接收保存商品信息的接口 */
router.post('/saveProductInfo', function(req, res, next) {

    let uid = req.body.uid; //用户的id
    let p_note = req.body.detail;   //商品介绍
    let p_imgs = JSON.stringify(req.body.imgs);  //商品图片数组
    let category = req.body.tags; //该商品所属类别数组。

    let arr = category.filter(item=>{
        return item.select
    })

    new Promise(function(resolve,reject){

        //1.插入product表格
        let addSql = `INSERT INTO product(p_note,p_imgs,isShow) VALUES(?,?,1)`;
        let sqlParam =  [p_note,p_imgs];
        db.query(addSql,sqlParam,function(err,result){
            resolve(result.insertId);
        })
    }).then(value=>{
        //2.插入用户和发布的关联表

        return new Promise(resolve=>{
            let addSql = `INSERT INTO user_product(uid,pid) VALUES(?,?)`;
            let sqlParam = [uid,value];
            db.query(addSql,sqlParam,function(err,result){
                resolve(value);
            })
        })
    }).then(value=>{
            //3.插入商品和分类的关联表

            let promiseArr = [];
            for(let i=0;i<arr.length;i++){
                promiseArr.push(
                    new Promise((reslove,reject)=>{
                        db.query(`INSERT INTO category_product(cid,pid) VALUES(?,?)`,[arr[i].cid,value],function () {
                            reslove(value)
                        })
                    })
                )
            }
            return Promise.all(promiseArr);

    }).then(value=>{
        //这里的value得到的是上面多个promise，每个里面reslove的一个结果

        //4.查询到该商品的详情，并且将该商品信息返回给前端，让前端直接去访问对应的详情页
        let selectSql = `select * from product where p_id=${value[0]}`;
        db.query(selectSql,function(err,result){
            result[0].uid = uid;
            res.end(JSON.stringify(retDataFormat(result)));
        })

    }).catch((err)=>{
        res.end(JSON.stringify(retDataFormat(err.message)));
    })

});

//查询所有商品列表
router.post('/selectProductList',function(req,res,next){
    let start = req.body.start;
    let length = req.body.length;
    //查询所有可见的商品
    let selectSql = `select * from product where product.isShow=1 order by p_createTime desc limit ${start},${length}`;
    db.query(selectSql,function (err,result) {
        res.end(JSON.stringify(retDataFormat(result)))
    })
})

//查找某个用户发布的所有的列表
router.post('/selectMyProductList',function(req,res,next){
    let start = req.body.start;
    let length = req.body.length;
    let uid = req.body.uid;

    let selectSql = `select product.* from user_product,product where user_product.uid=${uid} and user_product.pid=product.p_id order by product.p_createTime desc limit ${start},${length}`;
    db.query(selectSql,function (err,result) {
        res.end(JSON.stringify(retDataFormat(result)))
    })
})

//搜索栏中的模糊查询
router.post('/selectAboutProduct',function (req,res,next) {
    let keyword = req.body.keyword;
    //模糊查询也只能查询所有可见的商品
    let selectSql = `select * from product where product.p_note like '%${keyword}%' and product.isShow=1`;
    db.query(selectSql,function (err,result) {
        if(err){
            res.end(JSON.stringify(retDataFormat([])))
        }else{
            res.end(JSON.stringify(retDataFormat(result)))
        }
    })
})

//轮播图的数据
router.get('/bannerList',function (req,res,next) {
    //1.查询设置banner的表格，然后将对应的pid获取到，查询pid对应的商品信息
    let selectSql = `select product.* from setting_banner,product where setting_banner.pid=product.p_id`;
    db.query(selectSql,function (err,result) {
        res.end(JSON.stringify(retDataFormat(result)));
    })
})

module.exports = router;
