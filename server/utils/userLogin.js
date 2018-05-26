var express = require('express');
var router = express.Router();
var Sequelize = require('./db');

/* 登录接口 */
router.get('/userLogin', function(req, res, next) {
    let uname = '',upass = '';
   
    Sequelize.query(`select * from user where uname='${uname}' and upass='${upass}'`,{type:Sequelize.QueryTypes.SELECT}).then(function (results) {
        res.end(results);
    });
});

module.exports = router;