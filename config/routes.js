var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');
var authRole = require('../middleware/roleManager');

router.route('/api/users')
  .post(authRole(2), userController.create);

router.route('/api/users/spartans')
  .get(userController.getSpartans);

router.route('/api/users/spartans/:id')
  .get(authRole(0, 1, 2), userController.getSpartan)
  .patch(authRole(2), userController.update);

router.route('/api/enquiry')
  .post(authRole(1), userController.enquiry);

router.route('/api/enquiry')
  .patch(userController.annonymousEnquiry);

router.route('/api/users/:id')
  .get(userController.getUser);

module.exports = router;
