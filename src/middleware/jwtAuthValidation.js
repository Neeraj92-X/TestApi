const jwt = require('jsonwebtoken');
const helpers = require('../helpers');
const con = require("../constants/index");
const commonServices = require('../services/Common');
module.exports = async function (req, res, next) {
    // check if there is no token
    if (!req.headers.authorization) {
        return helpers.RH.cResponse(req, res, con.SC.UNAUTHORIZED, { en: con.RM.NO_TOKEN_AUTHORIZATION_DENIED })
    }
    //get token from header
    let token = req.headers.authorization.split(' ')[1];
    //verify token 
    try {
        const decodedToken = jwt.verify(token, process.env.JWTKEY);
        //check user Email
        const check = await commonServices.readSingleData(req, con.TN.USERS, '*', {
            "user_id": decodedToken.user_id
        })
        if (check.length == 0) {
            return helpers.RH.cResponse(req, res, con.SC.NOT_FOUND, { en: con.RM.RECORD_NOT_FOUND }, [], null);
        }
        req.token = decodedToken;
        next();
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            // if the error thrown is because the JWT is unauthorized, return a 401 error
            return helpers.RH.cResponse(req, res, con.SC.UNPROCESSABLE_ENTITY, { en: e.message }, [], null);
        }
        return helpers.RH.cResponse(req, res, con.SC.UNPROCESSABLE_ENTITY, { en: con.RM.SOMETHING_WENT_WRONG }, [], null);
    }
};