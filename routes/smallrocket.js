const express = require('express');
const smallrocket = require('../controller/smallrocket');

class Smallrocket {
  constructor() {
    this.router = express.Router();
    this.init();
  }
  init() {
    this.router.get("/", smallrocket.test);
  }
}

exports.default = new Smallrocket().router;