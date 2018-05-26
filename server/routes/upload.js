var express = require('express');
var multiparty = require('multiparty');
var fs = require('fs');
var router = express.Router();

var api = require('../utils/api');
var retDataFormat = require('../utils/retDataFormat');


/* 接收保存商品信息的接口 */
router.post(`/uploadImage`, function(req, res, next) {

    var form = new multiparty.Form();
    form.maxFilesSize = 100 * 1024 * 1024;
    form.parse(req, function(err, fields, files){

        //遍历
        let imgDatas = [];
        for(let i in fields){
            //将base64数据去掉前缀
            imgDatas.push(fields[i][0].replace(/^data:image\/\w+;base64,/,''));
        }
        let length = imgDatas.length;
        let imgUrls = [];

        for(let i = 0;i<length;i++){
            let dataBuffer = new Buffer(imgDatas[i], 'base64');
            let name = new Date().getTime();
            fs.writeFileSync(`public/images/${name}.png`,dataBuffer,function(err){
                if(err){
                    res.end(retDataFormat(err.message))
                    return;
                }
            })
            imgUrls.push(`${api}/images/${name}.png`);
        }

        res.end(JSON.stringify(retDataFormat(imgUrls)))
    });

});

module.exports = router;
