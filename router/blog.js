const Router = require('koa-router');
const {
    getArticleList,
    addArticle,
    getArticleDetail,
    editArticle,
    deleteArticle,
    getHomeList,
    updateData
} = require('../controls/blog');
let blog = new Router({});

/**
 * 热门文章
 */
// 列表
blog.post('/hot/article/list', getArticleList);

// 新增
blog.post('/hot/article/add', addArticle);

// 编辑
blog.post('/hot/article/edit', editArticle);

// 详情
blog.post('/hot/article/detail', getArticleDetail);

// 删除
blog.post('/hot/article/delete', deleteArticle);

/**
 * 推荐文章
 */
// 列表
blog.post('/recommend/article/list', getArticleList);

// 新增
blog.post('/recommend/article/add', addArticle);

// 编辑
blog.post('/recommend/article/edit', editArticle);

// 详情
blog.post('/recommend/article/detail', getArticleDetail);

// 删除
blog.post('/recommend/article/delete', deleteArticle);

/**
 * 客户端
 */
// 首页列表
blog.post('/client/home/list', getHomeList);

// 文章详情
blog.post('/client/article/detail', getArticleDetail);

// 更新数据
blog.post('/client/update/data', updateData);

module.exports = blog;
