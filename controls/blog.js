const { connectPool } = require('../sql/connect');
const {
    getArticleList,
    addArticle,
    getArticleDetail,
    editArticle,
    deleteArticle,
    searchArticleCount,
    getClassifyArticleList,
    updateField,
} = require('../sql/sql');
const {
    getClientArticleList,
    updateData,
    getStatisticst,
    updateStatisticst,
    getArticleCount,
    getCommentList,
    addLevel1Comment,
    addLevel2Comment,
    getCommentTwoLevelList,
    getUpdateField,
    getList,
    add,
} = require('../sql/clientSql');
const {
    responseSuccess,
    responseError,
    changeResponseFormat,
    changeReuestFormat,
} = require('../utils/common');

/**
 * 获取热门文章列表
 */
exports.getArticleList = async (ctx) => {
    let getList = await connectPool(getArticleList(ctx.request.body));
    let searchCount = await connectPool(
        searchArticleCount(ctx.request.body.type)
    );
    responseSuccess(ctx, {
        list: changeResponseFormat(getList),
        total: searchCount[0].total,
    });
};

/**
 * 新增热门文章
 */
exports.addArticle = async (ctx) => {
    let options = ctx.request.body;
    let getList = await connectPool(addArticle(changeReuestFormat(options)));
    responseSuccess(ctx, {});
};

/**
 * 编辑热门文章
 */
exports.editArticle = async (ctx) => {
    let options = ctx.request.body;
    let update = await connectPool(editArticle(changeReuestFormat(options)));
    responseSuccess(ctx, {});
};

/**
 * 获取热门文章详情
 *
 */
exports.getArticleDetail = async (ctx) => {
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
exports.deleteArticle = async (ctx) => {
    let { articleId } = ctx.request.body;
    let article = await connectPool(deleteArticle(articleId));
    responseSuccess(ctx, {});
};

/**
 * 更新字段
 *
 */
exports.updateArticle = async (ctx) => {
    await connectPool(updateField('article', ctx.request.body));
    responseSuccess(ctx, {});
};

// 客户端
//--------------------------------------------------------------------
/**
 * 首页文章列表
 */
exports.getHomeList = async (ctx) => {
    let params = Object.assign({ page: 1, pageSize: 8 }, ctx.request.body);
    let hotList = await connectPool(getClassifyArticleList(1));
    let list = await connectPool(getClientArticleList(params));
    responseSuccess(ctx, {
        hotList: changeResponseFormat(hotList),
        list: changeResponseFormat(list),
    });
};

/**
 * 文章详情
 */
exports.getArticleDetail = async (ctx) => {
    let { articleId } = ctx.request.body;
    let detail = await connectPool(getArticleDetail(articleId));
    let commentList = await connectPool(getCommentList(articleId));
    for (var i = 0; i < commentList.length; i++) {
        let item = commentList[i];
        item.subComment = changeResponseFormat(
            await connectPool(getCommentTwoLevelList(item.id))
        );
    }
    if (detail.length > 0) {
        responseSuccess(ctx, {
            detail: changeResponseFormat(detail[0]),
            commentList: changeResponseFormat(commentList),
        });
    } else {
        responseError(ctx, 0, '没有查询到文章');
    }
};

/**
 *  更新数据库字段
 */
exports.updateData = async (ctx) => {
    let update = await connectPool(
        updateData('article', changeReuestFormat(ctx.request.body))
    );
    responseSuccess(ctx, {});
};

/**
 *  统计
 */
exports.getStatisticst = async (ctx) => {
    let statisticst = await connectPool(getStatisticst());
    await connectPool(updateStatisticst({ views: ++statisticst[0].views }));
    statisticst = await connectPool(getStatisticst());
    // 文章数量
    let count = await connectPool(getArticleCount());
    statisticst[0].article = count[0].count;
    responseSuccess(ctx, {
        statisticst: statisticst[0],
    });
};

/**
 *  更新统计
 */
exports.updateStatisticst = async (ctx) => {
    let statisticst = await connectPool(getStatisticst());
    let params = ctx.request.body;
    if (params.favorite) {
        params.favorite = ++statisticst[0].favorite;
    }
    await connectPool(updateStatisticst(params));
    responseSuccess(ctx, {});
};

/**
 * 获取评论列表
 */
exports.getCommentList = async (ctx) => {
    let list = await connectPool(getCommentList(ctx.body.articleId));
    responseSuccess(ctx, { list });
};

/**
 * 添加评论
 */
exports.addComment = async (ctx) => {
    let params = Object.assign({}, ctx.request.body);
    let comment = {
        id: ctx.request.body.articleId,
        comment: ctx.request.body.comment,
    };

    delete params.comment;

    // type 1 一级评论  2 二级评论
    let { type } = params;
    if (type === 1) {
        // 更新文章列表评论数量
        await connectPool(updateData('article', changeReuestFormat(comment)));

        delete params.type;
        await connectPool(addLevel1Comment(changeReuestFormat(params)));
    } else {
        delete params.type;
        await connectPool(addLevel2Comment(changeReuestFormat(params)));
    }
    responseSuccess(ctx, {});
};

/**
 * 更新评论字段
 */
exports.updateComment = async (ctx) => {
    let params = ctx.request.body;
    let comment = await connectPool(
        getUpdateField(
            params.type === 1 ? 'level_one_comment' : 'level_two_comment',
            changeReuestFormat(params)
        )
    );
    if (params.favorite) {
        comment[0].favorite += 1;
    } else {
        comment[0].favorite -= 1;
        if (comment[0].favorite <= 0) {
            omment[0].favorite = 0;
        }
    }

    if (params.type === 1) {
        await connectPool(
            updateData('level_one_comment', changeReuestFormat(comment[0]))
        );
    } else {
        await connectPool(
            updateData('level_two_comment', changeReuestFormat(comment[0]))
        );
    }

    responseSuccess(ctx, {});
};

/**
 * 获取留言板列表
 */
exports.getMessageList = async (ctx) => {
    let list = await connectPool(
        getList('message', 'where type=1 order by create_time desc')
    );
    for (var i = 0; i < list.length; i++) {
        let item = list[i];
        item.sub = changeResponseFormat(
            await connectPool(
                getList('message', `where parent_id=${item.id} and type=2`)
            )
        );
    }
    responseSuccess(ctx, {
        list: changeResponseFormat(list),
    });
};

/**
 * 添加留言
 */
exports.addMessage = async (ctx) => {
    await connectPool(add('message', changeReuestFormat(ctx.request.body)));

    responseSuccess(ctx, {});
};
