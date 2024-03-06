const userController = require("../src/controllers/user.controller");
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
    "/registration",
    validator(Joi, {
      name: Joi.string().required().min(3).max(50).regex(/^[a-zA-Z, ]*$/, con.RM.NAME_CAN_NOT_CONTIAN_SPECIAL_CHARACTER_AND_NUMBERS),
      email: Joi.string().email().required(),
      phone: Joi.number().integer().min(1000000000).max(9999999999).required(),
      password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/, con.RM.PASSWORD_MUST_BE_MINIMUM_).required()
    }),
    reqValidator,
    userController.registration)

  router.post(
    "/login",
    validator(Joi, {
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }),
    reqValidator,
    userController.login);


  router.post("/refreshToken", auth,
    reqValidator,
    userController.refreshToken);


  router.post('/logout', userController.logout);


  router.post(
    "/sendEmailOtp",
    validator(Joi, {
      email: Joi.string().email().required()
    }),
    reqValidator,
    userController.sendEmailOtp);

  router.post(
    "/forgetPassword",
    validator(Joi, {
      otp: Joi.number().integer().min(0).max(9999).required(),
      email: Joi.string().email().required(),
      password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/, con.RM.PASSWORD_MUST_BE_MINIMUM_).required(),
      confirmPassword: Joi.any().equal(Joi.ref('password'))
    }),
    reqValidator,
    userController.forgetPassword);

  router.get(
    "/verifyEmail/:verificationToken",
    reqValidator,
    userController.verifyEmail)

  router.get(
    "/userDetails",
    auth,
    reqValidator,
    userController.userDetails);

  router.get(
    "/sendEmailVerificationLink",
    auth,
    reqValidator,
    userController.sendEmailVerificationLink)

  router.post(
    "/updateUser",
    validator(Joi, {
      name: Joi.string().required().min(3).max(50).regex(/^[a-zA-Z, ]*$/, con.RM.NAME_CAN_NOT_CONTIAN_SPECIAL_CHARACTER_AND_NUMBERS),
      phone: Joi.number().integer().min(1000000000).max(9999999999).required(),
      updateKey: Joi.string().valid('profile', 'password').required(),
      oldPassword: Joi.string(),
      newPassword: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/, con.RM.PASSWORD_MUST_BE_MINIMUM_),
      confirmPassword: Joi.any().equal(Joi.ref('newPassword'))
    }),
    auth,
    reqValidator,
    userController.updateUser)
  router.post("/uploadProfileImage",
    auth,
    upload.any(),
    userController.uploadProfileImage)
};
