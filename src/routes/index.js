const router = require('express').Router();

router.get('/', (req, res) => {
  res.send({ message: 'Welcome to API root' });
});

module.exports = router;
