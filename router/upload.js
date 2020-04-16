const Router = require('koa-router');
const { uploadConfig } = require('../config/common');
let upload = new Router({});

// 上传图片
upload.post('/images', uploadConfig.single('file'), async (ctx, next) => {
    ctx.body = {
        path: '/uploads/' + ctx.req.file.filename,
        filename: 'http://localhost:3003/uploads/' + ctx.req.file.filename //返回文件名
    };
});

// 热门文章详情
module.exports = upload;
