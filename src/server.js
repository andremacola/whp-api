require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const whpServerStart = require('./controllers/whpServerStart');
const app = express();

app.use(express.json());
app.use(routes);
app.use('/cdn', express.static(__dirname + '/../cdn'));

app.listen(process.env.PORT, whpServerStart());
