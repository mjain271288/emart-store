require('dotenv-flow').config();
const express = require('express')
const cors = require('cors');
const router = require('./routes/index');
const { StatusCodes } = require('http-status-codes');
const app = express()
const port = process.env.API_PORT || 4000
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger/v1.json');

app.use('/api-docs/v1', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api',router);

app.use((error, req, res, next) => {
  const statusCode = error.status || error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  res.status(statusCode).send(error);
});

app.listen(port, () => {
  console.log(`Running a api server at http://localhost:${port}`)
})