const DB = require('../config/db')
const msgcode = require('../config/msgcode')

class veryrich {
    static test(request, response, next) {
        const SQL = 'CALL p_server_list';
        DB(SQL).then(results => {
            msgcode.success.data = results
            response.send(msgcode.success)
        }).catch(error => {
            msgcode.error.msg = error
            response.send(msgcode.error)
        })
    }
}

module.exports = veryrich