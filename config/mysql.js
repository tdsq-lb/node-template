const debug = require("debug");
const mysql = require("mysql");
class MySqlDB {
    constructor(config) {
        this.poolConfig = config;
        this.connect();
    }
    connect() {
        debug("api:mysql:config")("%o", this.poolConfig);
        this.pool = mysql.createPool(this.poolConfig);
        this.pool.getConnection(err => {
        });
        this.pool.on("error", err => {
            debug("api:mysql:connect:error")(err);
            if (err.code === "PROTOCOL_CONNECTION_LOST") {
                this.connect();
            }
        });
    }
    query(sqlStr, params) {
        return new Promise((resolve, reject) => {
            if (!sqlStr) {
                reject({ err: "non query string" });
                return;
            }
            this.pool.getConnection((err, conn) => {
                conn.config.queryFormat = function (query, values) {
                    if (!values) {
                        return query;
                    }
                    const sqlQuery = query.replace(/\:(\w+)/g, function (txt, key) {
                        if (values.hasOwnProperty(key)) {
                            return this.escape(values[key]);
                        }
                        return txt;
                    }.bind(this));
                    debug("api:mysql:query:string")("%s", sqlQuery);
                    return sqlQuery;
                };
                conn.query(sqlStr, params, (error, results, fields) => {
                    this.pool.releaseConnection(conn);
                    if (error) {
                        debug("api:mysql:query:string")("%s", sqlStr);
                        debug("api:mysql:query:params")("%o", typeof params === "undefined" ? "{}" : params);
                        reject({ error: error.message });
                        return;
                    }
                    debug("api:mysql:query:params")("%o", typeof params === "undefined" ? "{}" : params);
                    resolve(results);
                });
                conn.on("error", connErr => {
                    debug("api:mysql:query:error")(connErr);
                    if (connErr.code === "PROTOCOL_CONNECTION_LOST") {
                        this.connect();
                    }
                });
            });
        }).catch(err => debug("api:mysql:query")("%s", `query - error --> ${JSON.stringify(err)}`));
    }
    exec(sqlStr, params) {
        return this.query(sqlStr, params).then((result) => {
            if (result.length > 0) {
                return result[0];
            }
            return [];
        });
    }
    execMultiple(sqlStr, params) {
        return this.query(sqlStr, params).then((result) => {
            if (result.length > 0) {
                result.splice(-1, 1);
                return result;
            }
            return [];
        });
    }
    excuteQuery(sqlStr, params) {
        const lowerCaseSqlStr = sqlStr.toLocaleLowerCase();
        if (lowerCaseSqlStr.includes("insert") ||
            lowerCaseSqlStr.includes("update") ||
            lowerCaseSqlStr.includes("delete")) {
            return this.excuteNonQuery(sqlStr, params);
        }
        return this.query(sqlStr, params);
    }
    fetchOne(sqlStr, params) {
        const lowerCaseSqlStr = sqlStr.toLocaleLowerCase();
        if (lowerCaseSqlStr.includes("insert") ||
            lowerCaseSqlStr.includes("update") ||
            lowerCaseSqlStr.includes("delete")) {
            return this.excuteNonQuery(sqlStr, params);
        }
        return this.query(sqlStr, params)[0];
    }
    fetchAll(sqlStr, params) {
        const lowerCaseSqlStr = sqlStr.toLocaleLowerCase();
        if (lowerCaseSqlStr.includes("insert") ||
            lowerCaseSqlStr.includes("update") ||
            lowerCaseSqlStr.includes("delete")) {
            return this.excuteNonQuery(sqlStr, params);
        }
        return this.query(sqlStr, params);
    }
    excuteNonQuery(sqlStr, params) {
        if (sqlStr.toLocaleLowerCase().includes("select")) {
            return this.query(sqlStr, params);
        }
        return this.query(sqlStr, params).then((result) => result);
    }
}
exports.default = MySqlDB;
