var express = require('express');
var router = express.Router();
var db = require('../utils/db');
var retDataFormat = require('../utils/retDataFormat');
var md5 = require('../utils/md5');
/* 登录的接口 */

router.post(`/`, function(req, res, next) {

    let uname = req.body.uname; 
    let upass = req.body.upass;

    upass = md5(upass);

    //拼接sql语句
    let sql = `select * from user where uname='${uname}' and upass='${upass}'`;

    //执行sql语句
    db.query(sql,function(err,result){
        if(err){
            //服务器出错时的操作
            res.end(JSON.stringify(retDataFormat(err)));
            return;
        }else{
            res.end(JSON.stringify(retDataFormat(result)));
        }
    })
});

module.exports = router;
