const MySql = require('../config/mysql')
const dbConfig = require('../config/mysql.config.json')

const db = new MySql.default(dbConfig.connConfig)

const msgcode = require('../config/msgcode')

class veryrich {
    static async test(request, response, next) {
        const reportid = 'fff'
        const result = await db.exec("call p_server_list(:reportid)", {reportid})
        console.log(result, '===========>>>>')
        response.send(result)
    }
}

module.exports = veryrich