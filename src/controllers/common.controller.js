const helpers = require('../helpers/index');
const con = require("../constants/index");
const readXlsxFile = require('read-excel-file/node');

const commonController = {
    uploadFile: async (req, res) => {
        try {
            let { key } = req.body
            let files = req.files
            if (!files || files.length == 0) {
                return helpers.RH.cResponse(req, res, con.SC.PRECONDITION_FAILED, con.RM.PLEASE_PROVIDE_FILE);
            }
            const image = []
            for (let file of files) {
                const allowedMimes = ['image/jpeg', 'image/png'];
                if (!allowedMimes.includes(file.mimetype)) {
                    return helpers.RH.cResponse(req, res, con.SC.BAD_REQUEST, con.RM.INVALID_FILE_TYPE)
                }
                let uploadedImage = await helpers.S3.uploadFileToS3(file.buffer, `${key}/${Date.now()}-${file.originalname}`, 'public')
                image.push(uploadedImage)
            }
            return helpers.RH.cResponse(req, res, con.SC.SUCCESS, con.RM.FILE_UPLOADED_SUCCESSFULLY, { image: image });
        } catch (error) {
            return helpers.RH.cResponse(req, res, con.SC.EXPECTATION_FAILED, error);
        }
    },
    readXlsxFileAsync: async (filePath) => {
        return new Promise((resolve, reject) => {
            readXlsxFile(filePath)
                .then((rows) => {
                    resolve(rows);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },

}
module.exports = commonController;