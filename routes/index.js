var express = require('express');
var router = express.Router();
const DB = require('../config/db')
const msgcode = require('../config/msgcode')
const veryrich = require('../controller/index')

/* GET home page. */
// router.get('/', function (req, res, next) {
//   const SQL = 'CALL p_server_list';
//   DB(SQL).then(results => {
//     msgcode.success.data = results
//     res.send(msgcode.success)
//     console.log(msgcode.success)
//   })
//   // res.render('index', { title: 'Express' });
// });

router.get('/',veryrich.test)

module.exports = router;
