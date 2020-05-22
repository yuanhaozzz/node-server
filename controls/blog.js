const { connectPool } = require('../sql/connect')
const {
    getArticleList,
    addArticle,
    getArticleDetail,
    editArticle,
    deleteArticle,
    searchArticleCount,
    getClassifyArticleList
} = require('../sql/sql')
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
    updateLevel1Comment,
    updateLevel2Comment
} = require('../sql/clientSql')
const {
    responseSuccess,
    responseError,
    changeResponseFormat,
    changeReuestFormat
} = require('../utils/common')

/**
 * 获取热门文章列表
 */
exports.getArticleList = async ctx => {
    let getList = await connectPool(getArticleList(ctx.request.body))
    let searchCount = await connectPool(
        searchArticleCount(ctx.request.body.type)
    )
    responseSuccess(ctx, {
        list: changeResponseFormat(getList),
        total: searchCount[0].total
    })
}

/**
 * 新增热门文章
 */
exports.addArticle = async ctx => {
    let options = ctx.request.body
    let getList = await connectPool(addArticle(changeReuestFormat(options)))
    responseSuccess(ctx, {})
}

/**
 * 编辑热门文章
 */
exports.editArticle = async ctx => {
    let options = ctx.request.body
    let update = await connectPool(editArticle(changeReuestFormat(options)))
    responseSuccess(ctx, {})
}

/**
 * 获取热门文章详情
 *
 */
exports.getArticleDetail = async ctx => {
    let { articleId } = ctx.request.body
    let detail = await connectPool(getArticleDetail(articleId))
    if (detail.length > 0) {
        responseSuccess(ctx, { detail: changeResponseFormat(detail[0]) })
    } else {
        responseError(ctx, 0, '没有查询到文章')
    }
}

/**
 * 删除文章
 *
 */
exports.deleteArticle = async ctx => {
    let { articleId } = ctx.request.body
    let article = await connectPool(deleteArticle(articleId))
    responseSuccess(ctx, {})
}

// 客户端
//--------------------------------------------------------------------
/**
 * 首页文章列表
 */
exports.getHomeList = async ctx => {
    let params = Object.assign({ page: 1, pageSize: 8 }, ctx.request.body)
    let hotList = await connectPool(getClassifyArticleList(1))
    let list = await connectPool(getClientArticleList(params))
    responseSuccess(ctx, {
        hotList: changeResponseFormat(hotList),
        list: changeResponseFormat(list)
    })
}

/**
 * 文章详情
 */
exports.getArticleDetail = async ctx => {
    let { articleId } = ctx.request.body
    let detail = await connectPool(getArticleDetail(articleId))
    let commentList = await connectPool(getCommentList(articleId))
    for(var i = 0; i < commentList.length; i++) {
        let item = commentList[i]
        item.subComment = changeResponseFormat(await connectPool(getCommentTwoLevelList(item.id)))
    }
    if (detail.length > 0) {
        responseSuccess(ctx, { detail: changeResponseFormat(detail[0]), commentList: changeResponseFormat(commentList) })
    } else {
        responseError(ctx, 0, '没有查询到文章')
    }
}

/**
 *  更新数据库字段
 */
exports.updateData = async ctx => {
    let update = await connectPool(
        updateData(changeReuestFormat(ctx.request.body))
    )
    responseSuccess(ctx, {})
}

/**
 *  统计
 */
exports.getStatisticst = async ctx => {
    let statisticst = await connectPool(getStatisticst())
    await connectPool(updateStatisticst({views: ++statisticst[0].views}))
    statisticst = await connectPool(getStatisticst())
    // 文章数量
    let count = await connectPool(getArticleCount())
    statisticst[0].article = count[0].count
    responseSuccess(ctx, {
        statisticst: statisticst[0]
    })
}

/**
 *  更新统计
 */
exports.updateStatisticst = async ctx => {
    let statisticst = await connectPool(getStatisticst())
    let params = ctx.request.body
    if (params.favorite) {
        params.favorite = ++statisticst[0].favorite
    }
    await connectPool(updateStatisticst(params))
    responseSuccess(ctx, {})
}


/**
 * 获取评论列表
 */
exports.getCommentList = async ctx => {
    
    let list = await connectPool(getCommentList(ctx.body.articleId))
    responseSuccess(ctx, {list})
}

/**
 * 添加评论
 */
exports.addComment = async ctx => {
   
    let params = Object.assign({}, ctx.request.body)
    let comment = {id:  ctx.request.body.articleId,comment: ctx.request.body.comment}

    delete params.comment
    await connectPool(updateData(changeReuestFormat(comment)))

     // type 1 一级评论  2 二级评论
     let {type} = params
     if (type === 1) {
        delete params.type
        await connectPool(addLevel1Comment(changeReuestFormat(params)))
     } else {
        delete params.type
        await connectPool(addLevel2Comment(changeReuestFormat(params)))
     }
    responseSuccess(ctx, {})
}

/**
 * 更新评论字段
 */
exports.updateComment = async ctx => {
    delete params.comment
    let params = ctx.request.body
    if (params.type === 1) {
        await connectPool(updateLevel1Comment(changeReuestFormat(params)))
    } else {
        await connectPool(updateLevel2Comment(changeReuestFormat(params)))
    }
 
    responseSuccess(ctx, {})
}