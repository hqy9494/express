
var express = require('express');
var router = express.Router();
var URL = require('url');
//加载mysql模块
var mysql      = require('mysql');
//创建连接
var connection = mysql.createConnection({
host     : 'localhost',
user     : 'root',
password : '',
database : 'user'
});
//执行创建连接 
connection.connect();
//SQL语句
var  sql = 'SELECT * FROM users';
var  addSql = 'INSERT INTO users(user,pass,tel) VALUES(?,?,?)';



/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
    // res.send(req.query)
});
router.get('/add', function(req, res, next) {
    var query = URL.parse(req.url, true).query;
    var addSqlParams = [query.user, query.pass, query.tel];
    connection.query(addSql,addSqlParams,function (err, result) {
        if(err){
         console.log('[INSERT ERROR] - ',err.message);
         return;
        }             
    });
    res.send(query);
});
router.get('/del', function(req, res, next) {
    res.send('respond with a resource');
});
router.get('/sel', function(req, res, next) {
    res.send('respond with a resource');
});
router.post('/edit', function(req, res) {
    var num = req.body.num;
    res.send("你获取的post数据为:" + num);
});
module.exports = router;