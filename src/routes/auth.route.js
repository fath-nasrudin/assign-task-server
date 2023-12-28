const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const loginLimiter = require('../middleware/loginLimiter');

router.route('/login')
  .post(loginLimiter, authController.login);

router.route('/refresh')
  .get(authController.refresh);

router.route('/logout')
  .get(authController.logout);

module.exports = router;
