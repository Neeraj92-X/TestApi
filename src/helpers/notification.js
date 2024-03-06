// const helpers = require('../helpers/index');
// const con = require("../constants/index");
// var admin = require("firebase-admin");
// const { getMessaging } = require("firebase-admin/messaging")
// const catchError = require("../handler/errorHandler");

// var serviceAccount = require("../../config/firebase_notification.json");

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// })

// const notifications = {
//     sendNotificatonForRetailer: async (tokenData, infoData) => {
//         console.info(tokenData)
//         try {
//             const registrationTokens = tokenData
//             const message = {
//                 notification: {
//                     title: infoData.title,
//                     body: infoData.body
//                 },
//                 tokens: registrationTokens
//             };
//             try {
//                 const response = await getMessaging().sendMulticast(message);

//                 console.log(response);
//                 console.log(JSON.stringify(response));

//                 if (response.failureCount > 0) {
//                     const failedTokens = response.responses
//                         .filter(resp => !resp.success)
//                         .map((_, idx) => registrationTokens[idx]);

//                     console.log('List of tokens that caused failures: ' + failedTokens);
//                 }
//                 return response
//             } catch (error) {
//                 console.error(error);
//             }

//         } catch (error) {
//             console.log(error)
//             return helpers.RH.cResponse(req, res, con.SC.EXPECTATION_FAILED, error);
//         }
//         // These registration tokens come from the client FCM SDKs.

//     }
// }

// module.exports = notifications