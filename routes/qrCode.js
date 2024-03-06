const qrCodeController = require("../src/controllers/qrCode.controller");
const Joi = require("joi");
const validator = require("../src/middleware/joiValidator");
const reqValidator = require("../src/middleware/reqValidator");
const con = require("../src/constants/index");
const auth = require("../src/middleware/jwtAuthValidation");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = (router) => {
    router.post(
        "/addEditQrCode",
        auth,
        upload.any(),
        validator(Joi, {
            urlId:Joi.number().required(),
            qrStyle:Joi.string().required(),
            qrCodeId:Joi.number()
        }),
        reqValidator,
        qrCodeController.addEditQrCode)
};
