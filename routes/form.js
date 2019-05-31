
var express = require('express');
var router = express.Router();
var URL = require('url');
var uuid = require('node-uuid');
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
var  addSql = 'INSERT INTO users(id,user,pass,tel) VALUES(?,?,?,?)';
var delSql = 'DELETE FROM users WHERE id=?'
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
router.get('/add', function(req, res, next) {
    var query = URL.parse(req.url, true).query;
    var addSqlParams = [uuid.v4().replace(/\-/g,''),query.user, query.pass, query.tel];
    connection.query(addSql,addSqlParams,function (err, result) {
        if(err){
         console.log('[INSERT ERROR] - ',err.message);
         return;
        }             
    });
    connection.query(sql,function (err, result) {
        if(err){ 
          console.log('[SELECT ERROR] - ',err.message);
          return;
        }
        // console.log(params.id);
        
        //把搜索值输出
       res.send(result);
    });
    // res.send(query);
});
router.get('/del', function(req, res, next) {
    // console.log(req.query.id)
    var deleteSqlParams = [req.query.id];
    connection.query(delSql,deleteSqlParams,function (err, result) {
        if(err){
         console.log('[DELETE ERROR] - ',err.message);
         res.send('Error')
         return;
        }
        if(result){
            connection.query(sql,function (err, result) {
                if(err){ 
                  console.log('[SELECT ERROR] - ',err.message);
                  return;
                }
                // console.log(params.id);
                
                //把搜索值输出
               res.send(result);
            });
        }            
    });
});
router.get('/sel', function(req, res, next) {
    // let keys = obj(req.query)
    connection.query(sql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        }
        
        //把搜索值输出
        res.send(result);
    });
});

router.post('/edit', function(req, res) {
    let body = req.body;
    let keys = Object.keys(body);
    // let editSql = `UPDATE users SET xxxx WHERE id=${body.id}`
    let str = "";
    keys.map(e=>{
        if(e != 'id'){
            str += `${e}='${body[e]}',`
        }
    })
    str = str.slice(0,str.length-1);
    let editSql = `UPDATE users SET ${str} WHERE id='${body.id}'`
    // editSql = `UPDATE users SET user=6666,pass=6666,tel=6666 WHERE user=1112233`
    console.log(editSql)
    connection.query(editSql,(err, result)=>{
        if(err){
            console.log('[UPDATE ERROR] - ',err.message);
            return;
        }
        if(result){
            connection.query(sql,function (err, result) {
                if(err){ 
                  console.log('[SELECT ERROR] - ',err.message);
                  return;
                }
                // console.log(params.id);
                
                //把搜索值输出
               res.send(result);
            });
        }   
        // res.send(editSql) 
    })
    // res.send(editSql)
});

router.post('/find', function(req, res) {
    let body = req.body;
    let keys = Object.keys(body);
    // let editSql = `UPDATE users SET xxxx WHERE id=${body.id}`
    let str = "";
    keys.map(e=>{
        if(e != 'id'){
            str += `${e}='${body[e]}' AND `
        }
    })
    str = str.slice(0,str.length-5);
    let findSql = `SELECT * FROM users WHERE ${str}`
    // editSql = `UPDATE users SET user=6666,pass=6666,tel=6666 WHERE user=1112233`
    console.log(findSql)
    connection.query(findSql,(err, result)=>{
        if(err){
            console.log('[UPDATE ERROR] - ',err.message);
            return;
        }
        res.send(result) 
    })
});
module.exports = router;