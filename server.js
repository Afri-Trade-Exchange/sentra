const express = require('express');
const compression = require('compression');
const app = express();

app.use(compression());

// Other middleware and routes

app.listen(5173, () => {
  console.log('Server is running on port 3000');
});