require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const { logHandler } = require('./middleware/log.midleware');
const { errorHandler } = require('./middleware/error.middleware');
const corsOptions = require('./config/corsOptions');

const app = express();

app.use(logHandler);
app.use(cors(corsOptions));
app.use(cookieParser());
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
