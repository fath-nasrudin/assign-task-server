const router = require('express').Router();
const userController = require('../controllers/user.controller');
const { verifyJWT } = require('../middleware/auth.middleware');

router.use(verifyJWT);

router.route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router.route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .put(userController.updateUser)
  .patch(userController.updateUser);

module.exports = router;
