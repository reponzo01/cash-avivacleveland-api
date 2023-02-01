import * as express from 'express';
import { AppSettings } from '../appSettings';
import { Logger } from '../logger/logger';
import User from '../models/User';

class UsersRoutes {
  public router: express.Router;
  public logger: Logger;

  constructor() {
    this.router = express.Router();
    this.routes();
    this.logger = new Logger();
  }

  private routes(): void {
    // request to get all users
    this.router.get('/', (req, res, next) => {
      // res.json(user);
      res.status(200).send('getting all users');
    });

    // request to get my logged in user
    this.router.get('/me', (req, res, next) => {
      res.json(req.user);
    });

    // request to get user by id
    this.router.get('/:id', (req, res, next) => {
      res.status(AppSettings.HTTP_STATUS_NOT_FOUND).send('Not yet implemented.');
    });
  }
}

export default new UsersRoutes().router;
