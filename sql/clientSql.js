let {
    updateTabledata,
    getObjectKey,
    getObjectValue,
} = require('../utils/common');
/**
 * 获取文章
 * @param {Object} options 数据集合
 */
exports.getClientArticleList = (options) => {
    let { page, pageSize, type } = options;
    // order by release_time desc
    // 查询字段
    let queryDbField =
        ' id, title, description, author, cover, image_url, page_views, release_time, type, online, likes, comment from article ';
    // 查询条数
    let pagination = `${(page - 1) * pageSize}, ${pageSize}`;
    switch (type) {
        case 0:
            // 所有
            return getAllArticleList(queryDbField, pagination);
        case 1:
            // 最新
            return getNewestArticleList(queryDbField, pagination);
        case 2:
            // 最热
            return getHotArticleList(queryDbField, pagination);
        case 3:
        case 4:
            // 分类  源码 面试题
            return getCategoryArticleList(queryDbField, pagination, options);
        case 5:
            // 关键字
            return getKeyWordArticleList(queryDbField, pagination, options);
    }
};

/**
 * 获取所有文章
 * @param {String} field 返回字段
 * @param {String} page  分页
 */
getAllArticleList = (field, page) => {
    return `select ${field} limit ${page}`;
};

/**
 * 获取最新文章
 * @param {String} field 返回字段
 * @param {String} page  分页
 */
getNewestArticleList = (field, page) => {
    return `select ${field} order by release_time desc limit ${page}`;
};

/**
 * 获取最热文章
 * @param {String} field 返回字段
 * @param {String} page  分页
 */
getHotArticleList = (field, page) => {
    return `select ${field} order by page_views desc limit ${page}`;
};

/**
 * 获取分类文章   源码  面试题
 * @param {String} field 返回字段
 * @param {String} page  分页
 * @param {Object} options  请求参数  type 3 源码 4 面试题
 */
getCategoryArticleList = (field, page, options) => {
    let { type } = options;
    return `select ${field} where type=${type} order by page_views desc limit ${page}`;
};

/**
 * 搜索关键词
 * @param {String} field    返回字段
 * @param {String} page     分页
 * @param {Object} options  keyword 关键词
 */
getKeyWordArticleList = (field, page, options) => {
    let { keyword } = options;
    return `select * from article where title like '%${keyword}%'`;
};

/**
 * 更新表字段
 * @param {String} table        表名
 * @param {Object} options      需要更新的字段
 */
exports.updateData = (table = 'article', options) => {
    let id = options.id;
    return `update ${table} set ${updateTabledata(options)} where id=${id}`;
};

/**
 * 获取首页信息
 */
exports.getStatisticst = () => {
    return `select * from statistics`;
};

/**
 * 更新首页信息
 */
exports.updateStatisticst = (options) => {
    return `update statistics set ${updateTabledata(options)}`;
};

/**
 * 获取文章数量
 */
exports.getArticleCount = () => {
    return `select count(id) as count from article`;
};

/**
 * 获取评论列表
 */
exports.getCommentList = (articleId) => {
    return `select * from level_one_comment where article_id=${articleId} order by create_time desc`;
};

/**
 * 获取二级评论列表
 */
exports.getCommentTwoLevelList = (parentId) => {
    return `select * from level_two_comment where parent_id=${parentId} order by create_time desc`;
};

/**
 * 添加一级评论
 * @param {Object} params 插入字段
 */
exports.addLevel1Comment = (params) => {
    return `insert into  level_one_comment (id, ${getObjectKey(
        params
    )}) values(null, ${getObjectValue(params)})`;
};

/**
 * 添加二级评论
 * @param {Object} params 插入字段
 */
exports.addLevel2Comment = (params) => {
    return `insert into  level_two_comment (id, ${getObjectKey(
        params
    )}) values(null, ${getObjectValue(params)})`;
};

/**
 * 获取更新字段
 * @param {String} table    表
 * @param {Object} options  参数选项
 */
exports.getUpdateField = (table, options) => {
    return `select ${getObjectKey(options)} from ${table} where id=${
        options.id
    }`;
};

/**
 * 获取列表
 * @param {String} table  表名
 * @param {String} condition  列表条件
 */
exports.getList = (table, condition) => {
    return `select * from ${table} ${condition}`;
};

/**
 * 添加数据
 * @param {String}   table      表名
 * @params {Object}  options    更新字段
 */
exports.add = (table, options) => {
    return `insert into ${table} (id, ${getObjectKey(
        options
    )}) values(null, ${getObjectValue(options)})`;
};
