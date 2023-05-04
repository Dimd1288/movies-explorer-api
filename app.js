const express = require('express');
require('dotenv').config();

const { NODE_ENV, MONGO_PROD } = process.env;

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const errorHandler = require('./middlewares/error-handler');
const routes = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { MONGO_DEV } = require('./utils/constants');

const app = express();

app.use(cors({ origin: ['http://localhost:3001', 'http://localhost:3000'], credentials: true, maxAge: 30 }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('strictQuery', false);
mongoose.connect(NODE_ENV === 'production' ? MONGO_PROD : MONGO_DEV);

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
