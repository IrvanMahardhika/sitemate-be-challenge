import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import http from 'http';

import { config } from 'dotenv';
config();

import router from './router';

const app = express();

app.use(cookieParser());
app.use(
	cors({
		credentials: true,
	}),
);
app.use(bodyParser.json());

const mongodbUrl =
	process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/sitemate-BE-challenge';

mongoose.Promise = Promise;
mongoose.connect(mongodbUrl);
mongoose.connection.on('error', (err) => console.log(err));

app.use('/', router());

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server is running of port ${PORT}`));
