const express = require('express');
const smallrocket = require('./smallrocket')

class BaseRouter {
  constructor() {
    this.router = express.Router();
    this.init()
  }
  init() {
    this.router.use("/",smallrocket.default)
  }
}

exports.default = new BaseRouter().router;
