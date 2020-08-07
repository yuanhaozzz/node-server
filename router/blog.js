const Router = require('koa-router');
const {
    getArticleList,
    addArticle,
    getArticleDetail,
    editArticle,
    deleteArticle,
    getHomeList,
    updateData,
    getStatisticst,
    updateStatisticst,
    getCommentList,
    addComment,
    updateComment,
    getMessageList,
    addMessage,
    updateArticle,
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

// 更新
blog.post('/hot/article/update', updateArticle);

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
 * 客户端---------------------------------------------------
 */
// 首页列表
blog.post('/client/home/list', getHomeList);

// 文章详情
blog.post('/client/article/detail', getArticleDetail);

// 更新文章数据（点赞等）
blog.post('/client/update/data', updateData);

// 获取统计数据
blog.post('/client/statisticst', getStatisticst);

// 更新统计数据
blog.post('/client/update/statisticst', updateStatisticst);

// 获取评论
blog.post('/client/comment/list', getCommentList);

// 添加评论
blog.post('/client/comment/add', addComment);

// 更新评论字段
blog.post('/client/comment/update', updateComment);

// 获取留言板列表
blog.post('/client/message/list', getMessageList);

// 添加留言
blog.post('/client/message/add', addMessage);

module.exports = blog;
