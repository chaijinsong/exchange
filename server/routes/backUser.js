var express = require('express');
var router = express.Router();

var retDataFormat = require('../utils/retDataFormat');
var db = require('../utils/db');
var api = require('../utils/api');

//更新用户的信息接口
router.post('/login/account', function(req, res, next) {
    const { password, userName, type } = req.body;
    let selectSql = `select * from back_user where uname='${userName}' and upass='${password}'`;

    db.query(selectSql,function (err,result) {

        if(err){
            res.send({
                status: 'error',
                type,
                currentAuthority: 'guest',
            })
            res.end();
        }
        if(result.length > 0){

            switch (result[0].type){
                case 0 :
                    //如果type为0，说明是超级管理员
                    res.send({
                        status: 'ok',
                        type,
                        currentAuthority: 'admin',
                        name : result[0].uname,
                        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
                        userid: result[0].uid,
                        notifyCount:0
                    });break;
                case 1 :
                    res.send({
                        status: 'ok',
                        type,
                        currentAuthority: 'user',
                        name : result[0].uname,
                        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
                        userid: result[0].uid,
                        notifyCount:0
                    });break;
                case 2 :
                    res.send({
                        status: 'ok',
                        type,
                        currentAuthority: 'third',
                        name : result[0].uname,
                        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
                        userid: result[0].uid,
                        notifyCount:0
                    });break;
            }

            res.end();


        }else{
            res.send({
                status: 'error',
                type,
                currentAuthority: 'guest',
            })
            res.end();
        }
    })

});

//获取所有管理员信息的接口
router.get('/getAllAdmin',function (req,res,next) {
    let selectSql = 'select * from back_user';
    db.query(selectSql,function (err,result) {
        res.send(result);
        res.end();
    })
})

//删除管理员信息的接口
router.get('/deleteAdmin',function (req,res,next) {
    let uid = req.query.uid;
    let deleteSql = `delete from back_user where uid=${uid}`;
    db.query(deleteSql,function (err,result) {
        res.send(retDataFormat('成功'));
        res.end();
    })
})

//新增管理员信息的接口
router.post('/addAdmin',function (req,res,next) {
    const {uname,upass,type} = req.body;
    let addSql = `insert into back_user (uname,upass,type) values(?,?,?)`;
    let addParam=[uname,upass,type];
    db.query(addSql,addParam,function (err,result) {
        res.send(retDataFormat('成功'));
        res.end();
    })
})

//查询所有用户接口
router.get('/getAllUser',function (req,res,next) {
    let selectSql = 'select * from user';
    db.query(selectSql,function (err,result) {
        res.send(result);
        res.end();
    })
})

//修改用户是否为黑户接口
router.post('/changeBlack',function (req,res,next) {
    console.log(req.body);
    const {uid,isBlack} = req.body;
    let updateSql = `update user set isBlack=${isBlack} where user.uid=${uid}`;
    db.query(updateSql,function (err,result) {
        if(err){
            res.send({
                success:false
            })
            res.end();
        }else{
            res.send({
                success:true
            })
            res.end();
        }
    })

})

//查询所有内容的接口
router.get('/getAllContent',function (req,res,next) {
    let selectSql = `select user.uname,user.uid,product.* from user,user_product,product where user_product.uid=user.uid and user_product.pid=product.p_id order by p_createTime desc`;
    db.query(selectSql,function(err,result){
        res.send(result);
        res.end();
    })
})

//修改商品的isShow的接口
router.post('/changeIsShow',function(req,res,next){
    const {p_id,isShow} = req.body;
    let updateSql = `update product set isShow=${isShow} where product.p_id=${p_id}`;
    db.query(updateSql,function(err,result){
        if(err){
            res.send({success:false})
        }else {
            res.send({success: true})
            res.end();
        }
    })
})

//查询所有审核通过的商品接口，即isShow为1的
router.get('/getAllShowContent',function (req,res,next) {
    let selectSql = `select user.uname,user.uid,product.* from user,user_product,product where user_product.uid=user.uid and user_product.pid=product.p_id and product.isShow=1 order by p_createTime desc`;
    db.query(selectSql,function(err,result){
        res.send(result);
        res.end();
    })
})

//修改商品是否为轮播图的接口
router.post('/changeIsBanner',function(req,res,next){
    const {p_id,isBanner} = req.body;
    let updateSql = `update product set isBanner=${isBanner} where product.p_id=${p_id}`;
    db.query(updateSql,function(err,result){
        if(err){
            res.send({success:false})
        }else {
            res.send({success: true})
            res.end();
        }
    })
})

//获取所有评价的接口,包含评论用户的id，评论商品的id，评论的全部信息
router.post('/getAllComment',function (req,res,next) {
    let selectSql = `select * from comment`;
    db.query(selectSql,function (err,result) {
        if(err){
            res.send({success:false})
        }else{
            res.send(result);
            res.end();
        }
    })
})

//修改评价状态的接口
router.post('/changeLegal',function (req,res,next) {
    const {cid,legal} = req.body;
    let updateSql = `update comment set comment.legal=${legal} where comment.cid=${cid}`;
    db.query(updateSql,function (err,result) {
        if(err){
            res.send({success:false})
            res.end();
        }else{
            console.log(result);
            res.send({success:true})
            res.end();
        }
    })
})

//获取所有分类的接口
router.get('/getAllCategory',function (req,res,next) {
    let selectSql = `select * from category`;
    db.query(selectSql,function (err,result) {
        res.send(result);
        res.end();
    })
})
//删除分类的接口
router.post('/deleteCategory',function (req,res,next) {
    console.log(req.body);
    let cid = req.body.cid; //获取分类的id
    let deleteSql = `delete from category where cid=${cid}`
    db.query(deleteSql,function (err,result) {
        if(result.affectedRows > 0){
            res.send({success:true})
        }else{
            res.send({success:false})
        }
        res.end();
    })
})

//新增分类的接口
router.post('/addCategory',function (req,res,next) {
    let cname = req.body.cname;
    let sqlParams = [cname,`${api}/images/category.png`];
    let insertSql = `insert into category (cname,cthumb) values(?,?)`;
    new Promise((resolve,reject)=>{
        //先插入，然后执行下一步
        db.query(insertSql,sqlParams,function (err,result) {
            resolve();
        })
    }).then(()=>{
        let selectSql = `select * from category`;
        db.query(selectSql,function (err,result) {
            res.send(result);
            res.end();
        })
    }).catch(err=>{
        res.send(err);
        res.end();
    })

})


module.exports = router;
