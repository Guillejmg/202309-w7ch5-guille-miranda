import cors from 'cors';
import express from 'express'
import morgan from 'morgan';
import createDebug from 'debug';
import { usersRouter } from './routers/router.users.js';
import { manualRouter } from './routers/manual.router.js';
import { errorMiddleware } from './middleware/error.middleware.js';

const debug = createDebug('W7E:app');

export const app = express();
debug('Starting');

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.static('public'));

app.use('/manual', manualRouter);
app.use('/users', usersRouter); 

app.use(errorMiddleware);
