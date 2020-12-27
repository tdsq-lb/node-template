const DB_MYSQL = require('mysql');
const DB_CONFIG = require('./db.config');

/**
 * 数据库连接池
 */
const pool = DB_MYSQL.createPool({
    host: DB_CONFIG.database.HOST,
    user: DB_CONFIG.database.USERNAME,
    password: DB_CONFIG.database.PASSWORD,
    database: DB_CONFIG.database.DATABASE,
    port: DB_CONFIG.database.PORT
})

/**
 * 通用方法
 */
const DB = (sql, options) => {
    options = (options) ? options : {}
    return new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if (error) {
                reject(error);
            } else {
                connection.query(sql, options, (error, results, fields) => {
                    //事件驱动回调
                    if (results) {
                        results.splice(-1, 1)
                        let arr = JSON.parse(JSON.stringify(results))
                        if (arr.length > 1) {
                            let list = []
                            for (let key in arr) {
                                list[key] = arr[key][0]
                            }
                            resolve(list);
                        }
                        resolve(...arr[0]);
                    }
                    if (error) {
                        reject(error)
                    }
                    //释放连接
                    // connection.release();
                });
            }
            pool.releaseConnection(connection);
        });
    })
};
module.exports = DB;