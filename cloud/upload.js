/**
 * Created by admin on 15/4/27.
 */
var express = require('express');
var router = express.Router();

/* GET 活动. */
router.get('/', function(req, res) {
    res.render('upload', {
        menu: 4,
        title: '活动'
    });
});

var fs = require('fs');
app.post('/upload', function(req, res){
    var iconFile = req.files.iconImage;
    if(iconFile){
        fs.readFile(iconFile.path, function(err, data){
            if(err)
                return res.send('读取文件失败');
            var base64Data = data.toString('base64');
            var theFile = new AV.File(iconFile.name, {base64: base64Data});
            theFile.save().then(function(theFile){
                res.send('上传成功！');
            });
        });
    }else
        res.send('请选择一个文件。');
});

module.exports = router;