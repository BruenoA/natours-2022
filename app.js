const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const toursRouter = require('./routes/tourRoutes');
const morgan = require('morgan');

require('dotenv').config();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use('/api/v1/tours', toursRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
