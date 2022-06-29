const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 3100;
app.use(
  cors({
    origin: '*',
  })
);
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
require('./routes/index.js')(app);

app.listen(port, () => console.log('Running on port ', port));
