require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const WhpServerStart = require('./controllers/WhpServerStart');
const whp = require('./config/whp');
const app = express();

app.locals.whp = whp;
app.set('view engine', 'ejs');
app.use(express.json());
app.use(routes);

app.listen(whp.port, WhpServerStart(app));

// app.listen(whp.port, function() {
// 	WhpServerStart(app);
// 	console.log(`\n⚡ Listening on http://localhost:${whp.port}!`);
// });
