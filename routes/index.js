const express = require('express');
const router = express.Router();

//import routes
// const preLoginApi = require('./preLoginApi');
const userApi = require('./user');

//We made groupping of routes 
// preLoginApi(router);
userApi(router);

module.exports = router;