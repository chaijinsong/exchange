var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
   
   res.end('哈哈');
});

module.exports = router;
