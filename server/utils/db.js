//连接数据库的js，导出连接对象
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '47.94.91.226',
  user     : 'root',
  password : '',
  database : 'exchange'
});
 
connection.connect();

module.exports = connection;
