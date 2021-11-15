'use strict';

// Start up DB Server
const { db } = require('./src/auth/models/index.js');
const {startup}=require('./src/server')
require('dotenv').config();
db.sync()
  .then(() => {
    // Start the web server
    startup(process.env.PORT||3001)
    // require('./src/server.js').start(process.env.PORT);
  });