import { Router as createRouter } from 'express';
import { UserController } from '../controllers/user.controller.js';
import createDebug from 'debug';
import { UserMongoRepo } from '../repo/repo.user/users.mongo.repo.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';

const debug = createDebug('W7E:users:router');

export const usersRouter = createRouter();
debug('Starting');

const repo = new UserMongoRepo();
const controller = new UserController(repo);
const interceptor = new AuthInterceptor();

usersRouter.get('/', controller.getAll.bind(controller));
usersRouter.post('/register', controller.create.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));
usersRouter.patch(
  '/login',
  interceptor.authorization.bind(interceptor),
  controller.login.bind(controller)
);
