var express = require('express');
var router = express.Router();
var db = require('../utils/db');
var retDataFormat = require('../utils/retDataFormat');
var api = require('../utils/api');
var md5 = require('../utils/md5');

/* 注册的接口 */
router.post(`/`, function(req, res, next) {

    let uname = req.body.uname;
    let upass = req.body.upass;
    let thumb = `${api}/images/header.png`; //默认的头像
    upass = md5(upass);

    let selectSql = `select * from user where uname='${uname}'`;

    new Promise(function (resolve,reject) {
        db.query(selectSql,function (err,result) {
            if(err){res.end(JSON.stringify(retDataFormat(err)))}
            if(result.length > 0){
                res.end(JSON.stringify(retDataFormat({exist:true})));
                return;
            }
            resolve();
        })
    }).then(()=>{
        let addSql = `INSERT INTO user(uname,upass,uphone,token,thumb) VALUES(?,?,NULL,NULL,?)`;
        let sqlParam =  [uname,upass,thumb];

        //1.先插入数据库
        db.query(addSql,sqlParam,function(err,result){
            if(err){
                res.end(JSON.stringify(retDataFormat(err)));
            }
            if(result.affectedRows > 0){
                let selectSql = `select * from user where uid='${result.insertId}'`
                db.query(selectSql,function(err,result){
                    if(err){
                        //服务器出错时的操作
                        res.end(JSON.stringify(retDataFormat(err)));
                    }else{
                        res.end(JSON.stringify(retDataFormat(result)));
                    }
                })

            }

        })
    }).catch((err)=>{
        res.end(JSON.stringify(retDataFormat(err)));
    })

});

module.exports = router;