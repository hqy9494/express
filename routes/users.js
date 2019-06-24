var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
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
var  addSql = 'INSERT INTO users(id,user,pass,tel,token) VALUES(?,?,?,?,?)';
var delSql = 'DELETE FROM users WHERE id=?'
let findUser = 'Select * FROM users WHERE user=?';



// router.use(function(req, res, next) {
//   // 拿取token 数据 按照自己传递方式写
//   var token = req.body.token || req.query.token || req.headers['authorization'];
//   if (token) {      
//       // 解码 token (验证 secret 和检查有效期（exp）)
//       jwt.verify(token, router.get('hqy'), function(err, decoded) {      
//         if (err) {
//           return res.json({ success: false, message: '无效的token.' });    
//         } else {
//           // 如果验证通过，在req中写入解密结果
//           req.decoded = decoded;  
//           console.log(token);
//           next(); //继续下一步路由
//         }
//       });
//     } else {
//       // 没有拿到token 返回错误 
//       return res.status(403).send({ 
//           success: false, 
//           message: '没有找到token.' 
//       });
//     }
//   });



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup',(req,res,next) =>{
  const body = req.body;
  console.log(req.body);
  // res.send(body.user);
  const {user,pass,tel} = body; 
    connection.query(findUser,[user],(err, result)=>{
        if(err){
            console.log('[UPDATE ERROR] - ',err.message);
            res.send(err.message);
            return;
        }
        if(result){
          if(result.length == 0){
            var token = jwt.sign(body, 'hqy', {
              expiresIn : 60*60*24// 授权时效24小时
            });
            const data = [uuid.v4(),user,pass,tel,token];
            connection.query(addSql,data,(err, result)=>{
                if(err){
                  console.log('[INSERT ERROR] - ',err.message);
                  res.send(err.message);
                  return;
                }
                if(result){
                    res.send({
                    success: true,
                    message: '请使用您的授权码',
                    token: token
                });
              }
            })
          }else{
            res.send({code:400,message:"该用户名已被注册！"})
          }
        }   
    })
})


router.post('/login',(req,res,next) =>{  
  const body = req.body;
  console.log(req.body);
  // res.send(body.user);
  const {user,pass} = body; 
    connection.query(findUser,[user],(err, result)=>{
        if(err){
            console.log('[UPDATE ERROR] - ',err.message);
            res.send({
              success: false,
              status: 0,
              message: '请求错误！'
            });
            return;
        }
        if(result.length == 0){
          res.send({
            success: false,
            status: 0,
            message: '无该用户！'
          });
        }else{
          if(result[0].pass == pass){
            res.send({
              success: true,
              status: 1,
              token: result[0].token
            });
          }
          else{
            res.send({
              success:false,
              status: 0,
              message: "密码错误！"
            })
          }
        }  
    })
})

module.exports = router;
