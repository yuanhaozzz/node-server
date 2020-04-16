const multer = require('koa-multer');

/**
 * 上传图片配置
 */
let storage = multer.diskStorage({
    //文件保存路径
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/');
    },
    //修改文件名称
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

exports.uploadConfig = multer({ storage: storage });
