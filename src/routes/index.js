const router = require('express').Router();
const userRoutes = require('./user.route');

router.get('/', (req, res) => {
  res.send({ message: 'Welcome to API root' });
});

router.use('/users', userRoutes);
router.use('/notes', require('./note.route'));
router.use('/auth', require('./auth.route'));

module.exports = router;
