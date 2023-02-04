import * as express from 'express';
import { Logger } from '../logger/logger';
import OrganizationsController from '../controllers/organizations';

class OrganizationsRoutes {
  public router: express.Router;
  public logger: Logger;

  constructor() {
    this.router = express.Router();
    this.routes();
    this.logger = new Logger();
  }

  private routes(): void {
    this.router.get('/', OrganizationsController.getOrganizations);

    this.router.get('/:id', OrganizationsController.getOrganizationById);

    this.router.post('/', OrganizationsController.postAddOrganization);
  }
}

export default new OrganizationsRoutes().router;
