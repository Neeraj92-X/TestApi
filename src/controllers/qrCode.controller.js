const helper = require("../helpers/index");
const jwtConfig = require("config").get("jwtConfig");
const con = require("../constants/index");
const bcrypt = require("bcryptjs");
const commonServices = require("../services/Common");
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const shortid = require("shortid")

const url = {
    addEditQrCode: async (req, res) => {
        try {
            let { urlId, qrStyle, qrCodeId } = req.body;
            let file = req.files.length !== 0 ? req.files[0] : null

            let url = await commonServices.readSingleData(req, con.TN.URL, "*", { id: urlId })
            if (url.length == 0) {
                return helper.RH.cResponse(req, res, con.SC.BAD_REQUEST, con.RM.URL_NOT_FOUND);
            }
            let base64String = null;
            if (file) {
                const imageObject = req.files[0]
                base64String = 'data:' + imageObject.mimetype + ';base64,' + imageObject.buffer.toString('base64');
            }

            if (qrCodeId) {
                let qrCode = await commonServices.readSingleData(req, con.TN.QRCODES, "*", { id: qrCodeId })
                if (qrCode.length == 0) {
                    return helper.RH.cResponse(req, res, con.SC.BAD_REQUEST, con.RM.RECORD_NOT_FOUND);
                }
                const updatedQrCode = await commonServices.dynamicUpdate(req, con.TN.QRCODES, {
                    url_id: urlId,
                    qr_style: qrStyle,
                    qr_image: base64String ? base64String : qrCode[0].qr_image
                }, { id: qrCodeId })
                return helper.RH.cResponse(req, res, con.SC.CREATED, con.RM.QR_UPDATED_SUCCESSFULLY)
            }
            let qr = await commonServices.readSingleData(req, con.TN.QRCODES, "*", { url_id: urlId })
            if (qr.length != 0) {
                return helper.RH.cResponse(req, res, con.SC.BAD_REQUEST, con.RM.QR_CODE_EXSISTS);
            }
            const qrCode = await commonServices.dynamicInsert(req, con.TN.QRCODES, {
                url_id: urlId,
                qr_style: qrStyle,
                qr_image: base64String,
                created_by: req.token.user_id
            })

            if (!qrCode) {
                return helper.RH.cResponse(req, res, con.SC.BAD_REQUEST, con.RM.SOMETHING_WENT_WRONG);
            }

            return helper.RH.cResponse(req, res, con.SC.CREATED, con.RM.QR_CREATED_SUCCESSFULLY)

        } catch (error) {
            return helper.RH.cResponse(req, res, con.SC.EXPECTATION_FAILED, error);
        }
    }
}

module.exports = url
