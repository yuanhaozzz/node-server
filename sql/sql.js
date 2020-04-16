let {
    getObjectKey,
    getObjectValue,
    updateTabledata
} = require('../utils/common');

/**
 * 查找是否注册
 * @parma {accountNumber} String 账号
 */
exports.selectIsRegister = accountNumber => {
    return `select * from user where account_number='${accountNumber}'`;
};

/**
 * 插入用户信息
 * @parma {options} Object 用户基本信息
 */
exports.insertIntoUser = options => {
    let { username, accountNumber, password, ip } = options;
    return `insert into user value(null, '${username}', '${accountNumber}', '${password}', '${ip}', NOW(), NOW())`;
};

/**
 * 验证用户账号密码
 * @parma {id} Int 用户主键id
 * @parma {ip} String 用户登录ip地址
 */
exports.updateLoginInfo = (id, ip) => {
    return `update user set ip='${ip}', login_time=NOW() where id=${id}`;
};

/**
 * 获取文章列表
 * @param {Int} type   1 热门文章 2 推荐文章
 */
exports.getArticleList = options => {
    let { type, page, pageSize } = options;
    return `select id, title, description, author, cover, image_url, page_views, release_time, type from article where type=${type}  order by release_time desc limit ${(page -
        1) *
        pageSize}, ${pageSize}`;
};

/**
 * 新增文章
 * @param {Object} options   增加字段
 */
exports.addArticle = options => {
    return `insert into article (id, ${getObjectKey(
        options
    )}) values(null,${getObjectValue(options)} )`;
};

/**
 * 获取文章详情
 * @param {Int} articleId   文章id
 */
exports.getArticleDetail = articleId => {
    return `select * from article where id=${articleId}`;
};

/**
 * 编辑文章详情
 * @param {Object} options   修改字段
 */
exports.editArticle = options => {
    let { id } = options;
    return `update article set ${updateTabledata(options)} where id=${id}`;
};

/**
 * 删除文章
 * @param {Int} articleId   文章ID
 */
exports.deleteArticle = articleId => {
    return `delete from article where id=${articleId}`;
};

/**
 * 查找文章数量
 * @param {Number} type 类型  1 热门文章 2 推荐文章
 */
exports.searchArticleCount = type => {
    return `select count(id) as total from article where type=${type}`;
};

/**
 * 获取分类文章列表
 * @param {Number} type   1 热门文章 2 推荐文章
 */
exports.getClassifyArticleList = type => {
    return `select id, title, description, author, cover, image_url, page_views, release_time, type from article where type=${type}  order by release_time desc limit 0, 8`;
};

/**
 * 获取所有文章  时间降序
 * @param {Object} options 数据集合
 */
exports.getAllArticleList = options => {
    let { page, pageSize } = options;
    return `select id, title, description, author, cover, image_url, page_views, release_time, type from article order by release_time desc limit ${(page -
        1) *
        pageSize}, ${pageSize}`;
};

/**
 * 更新表字段
 * @param {Object} options 需要更新的字段
 */
exports.updateData = options => {
    let id = options.id;
    return `update article set ${updateTabledata(options)} where id=${id}`;
};
