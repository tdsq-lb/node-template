const express = require('express');
const veryrich = require('../controller/index')

class BaseRouter {
  constructor() {
    this.router = express.Router();
    this.init()
  }
  init() {
    this.router.use("/",veryrich.test)
  }
}

exports.default = new BaseRouter().router;
