const userController = require("../src/controllers/user.controller");

module.exports = (router) => {
  router.get("/testApi", userController.testApi);
};
