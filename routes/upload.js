
const express = require('express');
const router = express.Router();
 const fs = require('fs');
 const multer  = require('multer');
const path = require('path');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'upload_tmp/');
    },
    filename: function (req, file, cb) {
      cb(null, `${file.originalname}`);
    }
  })

  var upload = multer({ storage: storage })


  router.post('/image', upload.any(), function(req, res, next){
    let src = path.join(__dirname, '../upload_tmp/' + req.files[0].originalname);
    res.end(src)
  })

    router.get('/image/:id',function(req, res, next){
        // console.log(req)
        let file = path.join(__dirname, '../upload_tmp/' + req.params.id);
        res.sendFile( file )
        // res.end(file)
        // res.download(file);
    })
 
 module.exports = router;