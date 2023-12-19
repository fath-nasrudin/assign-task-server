require('dotenv').config();
const mongoose = require('mongoose');
const { logEvents } = require('./src/helpers/logger');
const app = require('./src/app');
const dbConnect = require('./src/config/dbConn');

const PORT = process.env.PORT || 3000;

dbConnect();

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`server running on port ${3000}`));
});

mongoose.connection.on('error', (err) => {
  console.log(err);
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
});
