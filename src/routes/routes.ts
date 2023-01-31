import * as express from 'express';
import { Logger } from '../logger/logger';
import User from './user';

class Routes {
  public router: express.Router;
  public logger: Logger;

  // array to hold users
  public users: any[];

  constructor() {
    this.router = express.Router();
    this.routes();
    this.logger = new Logger();
  }

  private routes(): void {
    // user route
    // this.router.use('/', User);
  }
}

export default new Routes().router;
