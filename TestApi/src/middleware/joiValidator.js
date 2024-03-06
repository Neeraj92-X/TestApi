const helpers = require('../helpers/index');
const constants = require('../constants/index');


module.exports = (Joi,validationObject) => {
  return (req, res, next) => {
    const JoiSchema = Joi.object(validationObject).options({
      abortEarly: true,
    });
    const response = JoiSchema.validate(req.body);
    if (response.error) {
      return helpers.RH.cResponse(req,res, constants.SC.FORBIDDEN,response.error.details[0].message.replace(/"/g, ""));
    }
    next()
  };
};
