const urlController = require("../src/controllers/url.controller");
const Joi = require("joi");
const validator = require("../src/middleware/joiValidator");
const reqValidator = require("../src/middleware/reqValidator");
const con = require("../src/constants/index");
const auth = require("../src/middleware/jwtAuthValidation");

module.exports = (router) => {
    router.post(
        "/generateShortUrl",
        auth,
        validator(Joi, {
            longUrl: Joi.string().uri().required(),
            title: Joi.string().required(),
            type: Joi.string().valid('url', 'qr')
        }),
        reqValidator,
        urlController.generateShortUrl)

    router.get(
        "/getAllUrl",
        auth,
        reqValidator,
        urlController.getAllUrl)

    router.post(
        "/updateStatus",
        auth,
        validator(Joi, {
            urlId: Joi.array().items().min(1),
            urlStatus: Joi.string().valid('active', 'inactive').required()
        }),
        reqValidator,
        urlController.updateStatus)
    router.post(
        "/redirectUrl",
        validator(Joi, {
            shortId: Joi.string().required()
        }),
        reqValidator,
        urlController.redirectUrl)
    router.post(
        "/urlDetails",
        auth,
        validator(Joi, {
            urlId: Joi.number().integer().required()
        }),
        reqValidator,
        urlController.urlDetails)
    router.post(
        "/editUrl",
        auth,
        validator(Joi, {
            urlId: Joi.number().integer().required(),
            title: Joi.string().required(),
            longUrl: Joi.string().uri().required()
        }),
        reqValidator,
        urlController.editUrl)
};
