const express = require('express');
const routes = require('./routes');
const { logHandler } = require('./middleware/log.midleware');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();

app.use(logHandler);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', routes);
app.get('/', (req, res) => res.redirect('/api'));

app.all('*', (req, res) => {
  res.status(404).json({
    message: 'Sorry. Resources you have requested is not found!',
  });
});

app.use(errorHandler);

module.exports = app;
