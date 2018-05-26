var express = require('express');
var router = express.Router();

var retDataFormat = require('../utils/retDataFormat');
var db = require('../utils/db');

/*
    更新用户的信息接口
 */
router.post('/updateUserData', function(req, res, next) {

    let uid = req.body.uid;  //用户id
    let birthday = req.body.birthday; //用户生日
    let sex = req.body.sex; //用户性别，0为男，1为女
    let uphone = req.body.uphone; //用户的手机号
    let thumb = req.body.thumb; //用户头像

    let updateSql = '';
    //如果传来了thumb，即头像信息，就更新头像信息，否则不跟新头像信息
    if(thumb){
        updateSql = `update user set birthday='${birthday}',sex=${sex},uphone='${uphone}',thumb='${thumb}' where uid=${uid}`;
    }else{
        updateSql = `update user set birthday='${birthday}',sex=${sex},uphone='${uphone}' where uid=${uid}`;
    }

    db.query(updateSql,function (err,result) {

        //如果更新成功，继续查询
        if(result.affectedRows > 0){
            let selectSql = `select * from user where uid=${uid}`;
            db.query(selectSql,function (err,result) {
                res.end(JSON.stringify(retDataFormat(result)))
            })
        }

    })

});

module.exports = router;
