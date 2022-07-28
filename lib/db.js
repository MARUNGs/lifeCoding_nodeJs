// DB 정보 설정 - base
var mysql = require('mysql');

var db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '111111',
	database: 'opentutorials'
});
db.connect();
module.exports = db;