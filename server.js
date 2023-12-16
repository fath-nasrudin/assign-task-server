const app = require('./src/app');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server running on port ${3000}`));
