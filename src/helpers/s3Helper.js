// //aws
// const S3 = require('aws-sdk/clients/s3');
// const { nanoid } = require('nanoid');
// const s3Config = require('config').get('s3Config');
// const preSignedUrlExpiry = s3Config.preSignedUrlExpiry;
// const s3PrivateBucket = s3Config.privateBucket;
// const s3PublicBucket = s3Config.bucket;
// const mime = require('mime-types');
// const s3 = new S3({
//     accessKeyId: s3Config.accessKeyId,
//     secretAccessKey: s3Config.secretAccessKey,
//     region: s3Config.region
// });
// const s3Helper = {
//     uploadFileToS3: async (file, key, flag) => {
//         try {
//             if (flag === 'public') {
//                 const uploadParams = {
//                     Key: key,
//                     Body: file,
//                     Bucket:s3PublicBucket
//                 };

//                 let uploadFile = await s3.upload(uploadParams).promise();
//                 return uploadFile.Location;
//             } else {
//                 const uploadParams = {
//                     Key: key,
//                     Body: file,
//                     Bucket:s3PrivateBucket
//                 };

//                 await s3.upload(uploadParams).promise();
//                 const url = s3.getSignedUrl('getObject', {
//                     Bucket: s3PrivateBucket,
//                     Key: key,
//                     Expires: preSignedUrlExpiry,
//                 });
    
//                 return { key: key, signedUrl: url };
//             }


//         } catch (error) {
//             throw error;
//         }
//     },

//     checkFileInS3: async (fileKey) => {
//         try {
//             let params = {
//                 Bucket: s3PrivateBucket,
//                 Key: fileKey
//             };
//             return await s3.getObject(params).promise();
//         } catch (error) {
//             throw new customError("fileError", `File : ${fileKey}, doesn't exist.`);
//         }
//     },
//     createPreSignedUrl: async (fileKey) => {
//         try {
//             const url = s3.getSignedUrl('getObject', {
//                 Bucket: s3PrivateBucket,
//                 Key: fileKey,
//                 Expires: preSignedUrlExpiry
//             });
//             return url;
//         } catch (error) {
//             throw error;
//         }
//     },
//     deleteFileFromS3: async (key) => {
//         try {
//             var params = {
//                 Bucket: s3PrivateBucket,
//                 Key: key
//             };
//             const deleteFile = await s3.deleteObject(params).promise();
//             return deleteFile;
//         }
//         catch (error) {
//             throw error;
//         }
//     },
// }
// module.exports = s3Helper;