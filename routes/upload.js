
const express = require('express');
const router = express.Router();
 const fs = require('fs');
 const multer  = require('multer');




var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'upload_tmp/');
    },
    filename: function (req, file, cb) {
      cb(null, `${file.originalname}`);
    }
  })

  var upload = multer({ storage: storage })


  router.post('/image', upload.any(), function(req, res, next){
    res.end(`http://127.0.0.1:3001`)
})

    router.get('/download',function(req, res, next){
        res.end(`http://127.0.0.1:3001`)
    })
 
 module.exports = router;