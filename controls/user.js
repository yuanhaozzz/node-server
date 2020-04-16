const { connectPool } = require('../sql/connect');
const {
    responseSuccess,
    responseError,
    setToken,
    encryption,
    decrypt
} = require('../utils/common');
const {
    selectIsRegister,
    updateLoginInfo,
    insertIntoUser
} = require('../sql/sql');

exports.registerUser = async ctx => {
    let ip = ctx.ip;
    let { accountNumber, password, username } = ctx.request.body;
    // 查库
    let findResult = await connectPool(selectIsRegister(accountNumber));

    if (findResult.length > 0) {
        responseError(ctx, 1, '该用户已注册');
    } else {
        let hash = await encryption(password);
        // 入库
        let insertResult = await connectPool(
            insertIntoUser({ accountNumber, password: hash, username, ip })
        );
        // 生成token
        const token = setToken(accountNumber);
        responseSuccess(ctx, {
            id: insertResult.insertId,
            token,
            name: username
        });
    }
};

exports.login = async ctx => {
    let ip = ctx.ip;
    let { accountNumber, password } = ctx.request.body;
    let findResult = await connectPool(selectIsRegister(accountNumber));
    if (findResult.length > 0) {
        let { id, name } = findResult[0];
        let hash = await decrypt(password, findResult[0].password);
        if (hash) {
            await connectPool(updateLoginInfo(id, ip));
            // 生成token
            const token = setToken(accountNumber);
            responseSuccess(ctx, {
                id,
                token,
                name
            });
        } else {
            responseError(ctx, 0, '账号密码错误');
        }
    } else {
        responseError(ctx, 0, '您尚未注册该账号');
    }
};
