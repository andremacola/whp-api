import * as dotenv from 'dotenv';
import express from 'express';
import routes from './routes';
import whpServerStart from './controllers/whpServerStart';

dotenv.config();
const app = express();

import * as url from 'url';
// const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

app.use(express.json());
app.use(routes);
app.use('/cdn', express.static(__dirname + '/../cdn'));

app.listen(process.env.PORT, whpServerStart());
