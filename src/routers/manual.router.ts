import { Router as createRouter } from "express";
import { ManualController } from "../controllers/manual.controller.js";
import { ManualMongoRepo } from "../repo/repo.manual/manual.mongo.repo.js";
import createDebug from 'debug'
import { AuthInterceptor } from "../middleware/auth.interceptor.js";

const debug = createDebug('W7E:subjects:file:repo')

export const manualRouter = createRouter();
debug('Starting');

const repo = new ManualMongoRepo();
const controller = new ManualController(repo);
const interceptor = new AuthInterceptor();

manualRouter.get('/', 
interceptor.authoritation.bind(controller),
controller.getAll.bind(controller));

manualRouter.get('/:id', controller.getById.bind(controller));

manualRouter.get('/search', controller.search.bind(controller));

manualRouter.patch(
  '/:id',
  interceptor.authoritation.bind(interceptor),
  interceptor.authenticationManual.bind(interceptor),
  controller.update.bind(controller));

manualRouter.post(
  '/',
interceptor.authoritation.bind(interceptor),
  controller.create.bind(controller));

manualRouter.delete('/:id',
interceptor.authoritation.bind(interceptor),
  interceptor.authenticationManual.bind(interceptor),
controller.delete.bind(controller));
