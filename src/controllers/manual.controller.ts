import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { Repository } from '../repo/repo.js';
import { ManualStructure } from '../entities/manual.js';
import { Controller } from './controller.js';

const debug = createDebug('W7E:manual:controller');

export class ManualController extends Controller<ManualStructure>{
  // eslint-disable-next-line no-unused-vars
  constructor(protected repo: Repository<ManualStructure>) {
    super(repo);
    debug('Instantiated');
  }
  
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.employee = { id: req.body.userid };
      super.create(req, res, next);
    } catch (error) {
      next(error);
    }
  }
}
