'use strict';
require('dotenv').config();
const { users } = require('../models/index.js');
const SECRET = process.env.SECRET || 'zxcvbnm';
module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) { next('Invalid Login') }
    const token = req.headers.authorization.split(' ')[1];
    const validUser = await users.authenticateBearer(token,);
    req.user = validUser;
    req.token = validUser.token;
    next()
  } catch (e) {
    res.status(403).send(e.message || e);;
  }
}