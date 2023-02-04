import * as express from 'express';
import { Logger } from '../logger/logger';
import { Constants } from '../util/constants';
import OrganizationsRoutes from './organizations';

class ApiRoutes {
  public router: express.Router;
  public logger: Logger;

  constructor() {
    this.router = express.Router();
    this.routes();
    this.logger = new Logger();
  }

  private routes(): void {
    this.router.use('/organizations', OrganizationsRoutes);
  }
}

export default new ApiRoutes().router;
