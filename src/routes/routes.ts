import * as express from 'express';
import { AppSettings } from '../appSettings';
import { Logger } from '../logger/logger';
import AuthRoutes from './auth';
import UsersRoutes from './users';

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
    // auth routes
    this.router.use('/', AuthRoutes);

    // user routes
    this.router.use('/users', this.checkAuthenticationShow401, UsersRoutes);

    // api route
    // this.router.use('/api', Routes);

    // show Vue frontend
    // Do not do a global check for authentication. Be page selective.
    this.router.get('/dashboard*', this.checkAuthenticationRedirect, (req, res, next) => {
      res.sendFile(AppSettings.MAIN_CLIENT_HTML);
    });

    this.router.get('/*', (req, res, next) => {
      res.sendFile(AppSettings.MAIN_CLIENT_HTML);
    });

    // handle undefined routes
    this.router.use('*', (req, res, next) => {
      res.send('Make sure url is correct!!!');
    });
  }

  private checkAuthenticationRedirect(
    req: any,
    res: any,
    next: express.NextFunction
  ): void {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/login');
    }
  }

  private checkAuthenticationShow401(
    req: any,
    res: any,
    next: express.NextFunction
  ): void {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(AppSettings.HTTP_STATUS_UNAUTHORIZED).end();
    }
  }
}

export default new Routes().router;
