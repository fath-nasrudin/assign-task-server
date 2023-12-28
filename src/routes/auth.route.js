const router = require('express').Router();
const authController = require('../controllers/auth.controller');

router.route('/login')
  .post(authController.login);

router.route('/refresh')
  .get(authController.refresh);

router.route('/logout')
  .get(authController.logout);

module.exports = router;
