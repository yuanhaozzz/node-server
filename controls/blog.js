const { connectPool } = require('../sql/connect');
const {
    getArticleList,
    addArticle,
    getArticleDetail,
    editArticle,
    deleteArticle,
    searchArticleCount,
    getClassifyArticleList,
    getAllArticleList,
    updateData
} = require('../sql/sql');
const {
    responseSuccess,
    responseError,
    changeResponseFormat,
    changeReuestFormat
} = require('../utils/common');

/**
 * 获取热门文章列表
 */
exports.getArticleList = async ctx => {
    let getList = await connectPool(getArticleList(ctx.request.body));
    let searchCount = await connectPool(searchArticleCount(ctx.request.body.type));
    responseSuccess(ctx, {
        list: changeResponseFormat(getList),
        total: searchCount[0].total
    });
};

/**
 * 新增热门文章
 */
exports.addArticle = async ctx => {
    let options = ctx.request.body;
    let getList = await connectPool(addArticle(changeReuestFormat(options)));
    responseSuccess(ctx, {});
};

/**
 * 编辑热门文章
 */
exports.editArticle = async ctx => {
    let options = ctx.request.body;
    let update = await connectPool(editArticle(changeReuestFormat(options)));
    responseSuccess(ctx, {});
};

/**
 * 获取热门文章详情
 *
 */
exports.getArticleDetail = async ctx => {
    let { articleId } = ctx.request.body;
    let detail = await connectPool(getArticleDetail(articleId));
    if (detail.length > 0) {
        responseSuccess(ctx, { detail: changeResponseFormat(detail[0]) });
    } else {
        responseError(ctx, 0, '没有查询到文章');
    }
};

/**
 * 删除文章
 *
 */
exports.deleteArticle = async ctx => {
    let { articleId } = ctx.request.body;
    let article = await connectPool(deleteArticle(articleId));
    responseSuccess(ctx, {});
};

// 客户端

/**
 * 首页文章列表
 */
exports.getHomeList = async ctx => {
    let common = { page: 1, pageSize: 8 };
    let hotList = await connectPool(getClassifyArticleList(1));
    let recommendList = await connectPool(getClassifyArticleList(2));
    let list = await connectPool(getAllArticleList(common));
    responseSuccess(ctx, {
        hotList: changeResponseFormat(hotList),
        recommendList: changeResponseFormat(recommendList),
        list: changeResponseFormat(list)
    });
};

/**
 * 首页文章列表
 */
exports.getArticleDetail = async ctx => {
    let { articleId } = ctx.request.body;
    let detail = await connectPool(getArticleDetail(articleId));
    if (detail.length > 0) {
        responseSuccess(ctx, { detail: changeResponseFormat(detail[0]) });
    } else {
        responseError(ctx, 0, '没有查询到文章');
    }
};

/**
 *  更新数据库字段
 */
exports.updateData = async ctx => {
    let update = await connectPool(
        updateData(changeReuestFormat(ctx.request.body))
    );
    console.log(update, '==============');
    responseSuccess(ctx, {});
};
