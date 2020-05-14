let {
    updateTabledata
} = require('../utils/common')
/**
 * 获取文章
 * @param {Object} options 数据集合
 */
exports.getClientArticleList = options => {
    let {page, pageSize, type} = options
    // order by release_time desc
    // 查询字段
    let queryDbField = ' id, title, description, author, cover, image_url, page_views, release_time, type, online from article '
    // 查询条数
    let pagination = `${(page - 1) * pageSize}, ${pageSize}`
    switch(type) {
        case 0:
            // 所有
            return getAllArticleList(queryDbField, pagination)
        case 1:
            // 最新
            return getNewestArticleList(queryDbField, pagination)
        case 2:
            // 最热
            return getHotArticleList(queryDbField, pagination)
        case 3:
        case 4:
            // 分类  源码 面试题
            return getCategoryArticleList(queryDbField, pagination, options)
    }
   
}

/**
 * 获取所有文章
 * @param {String} field 返回字段
 * @param {String} page  分页
 */
getAllArticleList = (field, page) => {
    return `select ${field} limit ${page}`
}

/**
 * 获取最新文章
 * @param {String} field 返回字段
 * @param {String} page  分页
 */
getNewestArticleList = (field, page) => {
    return `select ${field} order by release_time desc limit ${page}` 
}

/**
 * 获取最热文章
 * @param {String} field 返回字段
 * @param {String} page  分页
 */
getHotArticleList = (field, page) => {
    return `select ${field} order by page_views desc limit ${page}` 
}

/**
 * 获取分类文章   源码  面试题
 * @param {String} field 返回字段
 * @param {String} page  分页
 * @param {Object} options  请求参数  type 3 源码 4 面试题
 */
getCategoryArticleList = (field, page, options) => {
    let {type} = options
    return `select ${field} where type=${type} order by page_views desc limit ${page}` 
}


/**
 * 更新表字段
 * @param {Object} options 需要更新的字段
 */
exports.updateData = options => {
    let id = options.id
    return `update article set ${updateTabledata(options)} where id=${id}`
}
