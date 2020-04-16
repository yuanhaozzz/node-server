// 生成token
const jwt = require('jsonwebtoken');
// 密码 加密解密
const bcrypt = require('bcrypt');

/**
 * 响应成功信息
 * @param {Object} ctx 上下文
 * @param {Object} data 数据
 */
exports.responseSuccess = (ctx, data) => {
    console.log('成功--------------');
    ctx.body = { code: 200, data, msg: 'success' };
};

/**
 * 响应失败信息
 * @param {Object} ctx 上下文
 * @param {Int} code 响应码
 * @param {String} msg 错误信息
 */
exports.responseError = (ctx, code, msg) => {
    ctx.body = { code, msg, data: {} };
};

/**
 * 生成toekn
 * @param {String}  accountNumber 账号
 */
exports.setToken = accountNumber => {
    return jwt.sign(
        {
            accountNumber
        },
        'my_token',
        { expiresIn: '24h' }
    );
};

/**
 * 密码加盐
 * @param {String} password 密码
 */
exports.encryption = password => {
    return new Promise(resolve => {
        //生成salt的迭代次数
        const saltRounds = 10;
        //生成salt并获取hash值
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                // hash生成的密码
                resolve(hash);
            });
        });
    });
};

/**
 * 用于登录时 加盐密码进行查询
 * @param {String} password 密码
 * @param {String} dbPassword 数据库密码
 * @param {Function} callback 回调
 */
exports.decrypt = (password, dbPassword) => {
    console.log(password, '---------password');
    console.log(dbPassword, '---------dbPassword');
    return new Promise(resolve => {
        bcrypt.compare(password, dbPassword, function(err, hash) {
            resolve(hash);
        });
    });
};

exports.changeResponseFormat = data => {
    if (Array.isArray(data)) {
        data.forEach(item => {
            for (var j in item) {
                if (item.hasOwnProperty(j)) {
                    if (j.includes('_')) {
                        key = j.replace(/\_(\w)/g, function(all, letter) {
                            return letter.toUpperCase();
                        });
                        item[key] = item[j];
                        delete item[j];
                    }
                }
            }
            return item;
        });
    } else {
        for (var i in data) {
            if (data.hasOwnProperty(i)) {
                if (i.includes('_')) {
                    key = i.replace(/\_(\w)/g, function(all, letter) {
                        return letter.toUpperCase();
                    });
                    data[key] = data[i];
                    delete data[i];
                }
            }
        }
    }
    return data;
};

/**
 * 驼峰转下划线
 */
exports.changeReuestFormat = data => {
    for (var i in data) {
        if (data.hasOwnProperty(i)) {
            if (i.match(/[A-Z]/g)) {
                key = i.replace(/([A-Z])/g, '_$1').toLowerCase();
                data[key] = data[i];
                delete data[i];
            }
        }
    }
    return data;
};

/**
 * 获取对象的key
 * @param {Object} object  对象
 */

exports.getObjectKey = object => {
    return Object.keys(object).join(', ');
};

/**
 * 获取对象的value
 * @param {Object} object  对象
 */

exports.getObjectValue = object => {
    return Object.values(object)
        .map(item => {
            if (typeof item === 'string') {
                return `'${item}'`;
            }
            return item;
        })
        .join(', ');
};

/**
 * 更新数据
 *
 */
exports.updateTabledata = data => {
    delete data.id;
    let str = '';
    for (let i in data) {
        if (data.hasOwnProperty(i)) {
            if (typeof data[i] === 'string') {
                str += ` ${i}='${data[i]}',`;
            } else {
                str += ` ${i}=${data[i]},`;
            }
        }
    }

    return str.substring(0, str.length - 1);
};
