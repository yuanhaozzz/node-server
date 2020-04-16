const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const koajwt = require('koa-jwt');

const { responseError } = require('./utils/common');
// 模块
const user = require('./router/user');
const blog = require('./router/blog');
const upload = require('./router/upload');

const app = new Koa();
var router = new Router({
    prefix: '/server',
});

app.use(bodyParser());
app.use(require('koa-static')(__dirname + '/public'));

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        console.log(error, 'error------------');
        responseError(ctx, 0, '未知错误');
    }
});
// 具体参数我们在后面进行解释
app.use(
    cors({
        origin: function (ctx) {
            console.log(ctx.header.referer, '----');
            // 服务器发送的请求中，请求头没有referer，通过ip来加入白名单
            if (ctx.request.ip.includes('127.0.0.1')) {
                ctx.header.referer = 'http://localhost:3001';
            }
            if (ctx.request.ip.includes('132.232.1.48')) {
                ctx.header.referer = 'http://yuanhao-web.cn';
            }
            let whiteList = [
                'http://localhost:3002',
                'http://localhost:3001',
                'http://192.168.1.6:3002',
                'http://yuanhao-web.cn',
            ];
            let url = ctx.header.referer.match(/(\w+):\/\/([^/:]+)(:\d*)?/)[0];
            console.log(url, '===2');
            if (whiteList.includes(url)) {
                console.log(url, '===1');
                return '*'; //注意，这里域名末尾不能带/，否则不成功，所以在之前我把/通过substr干掉了
            }
        },
        // exposeHeaders: ["WWW-Authenticate", "Server-Authorization"],
        maxAge: 5,
        credentials: true,
        allowMethods: ['GET', 'POST', 'DELETE'],
        // allowHeaders: ["Content-Type", "Authorization", "Accept"]
    })
);

// 验证token
app.use((ctx, next) => {
    return next().catch((err) => {
        if (err.status === 401) {
            responseError(ctx, 401, '用户身份已过期，请重新登录！');
        } else {
            throw err;
        }
    });
});

app.use(
    koajwt({
        secret: 'my_token',
    }).unless({
        // 白名单路径
        path: [/\/user/, /\/blog\/client/, /\/upload/],
    })
);

// 用户
router.use('/user', user.routes(), user.allowedMethods());
// 博客
router.use('/blog', blog.routes(), blog.allowedMethods());
// 上传
router.use('/upload', upload.routes(), upload.allowedMethods());

app.use(router.routes(), router.allowedMethods());

app.listen(3003, () => {
    console.log('start 3003');
});
