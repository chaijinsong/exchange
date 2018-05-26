var express = require('express');
var router = express.Router();
var Sequelize = require('../utils/db');

router.get('/', function(req, res, next) {
   
   res.end('哈哈');
});

module.exports = router;
