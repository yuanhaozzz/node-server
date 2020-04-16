const Router = require("koa-router");
const { login, registerUser } = require("../controls/user");
let user = new Router({});

// 登录
user.post("/login", login);
// 注册
user.post("/register", registerUser);

module.exports = user;
