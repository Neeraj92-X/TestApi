const express = require('express');
const router = express.Router();

//import routes
const userApi = require('./user');
const urlApi = require('./url');
const qrCodeApi = require('./qrCode');

//We made groupping of routes 
userApi(router);
urlApi(router);
qrCodeApi(router);

module.exports = router;