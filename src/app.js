const express = require('express');
const routes = require('./routes');
const { logHandler } = require('./middleware/log.midleware');

const app = express();

app.use(logHandler);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', routes);
app.get('/', (req, res) => res.redirect('/api'));

module.exports = app;
