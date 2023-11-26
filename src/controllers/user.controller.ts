/* eslint-disable no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import createDebug from 'debug';
import { UserMongoRepo } from '../repo/repo.user/users.mongo.repo.js';
import { Auth } from '../services/auth.js';
import { Controller } from './controller.js';
import { User } from '../entities/user.js';

const debug = createDebug('W7E:user:controller')

export class UserController extends Controller<User> {
  constructor(protected repo: UserMongoRepo ){
    // eslint-disable-next-line constructor-super
    super(repo);
    debug('Instantiated')
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = req.body.userId
        ? await this.repo.getById(req.body.userId)
        : await this.repo.login(req.body);

      const data = {
        user: result,
        token: Auth.signJWT({ // Este  objeto no es necesario pero decidios mandar los datos con el. token por que si pero no es necesario
          id: result.id,
          email: result.email,
        }),
      };
      res.status(202);
      res.statusMessage = 'Accepted';
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}
