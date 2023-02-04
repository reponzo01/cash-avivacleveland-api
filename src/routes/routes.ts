import * as express from 'express';
import ApiRoutes from './api';
import AuthRoutes from './auth';
import UsersRoutes from './users';
import { AppSettings } from '../appSettings';
import { Logger } from '../logger/logger';
import { StatusCodes } from 'http-status-codes';

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
    // TODO: This isn't authenticated yet! Testing only! Authenticate when not testing!
    this.router.use('/api', ApiRoutes);

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
      res.status(StatusCodes.UNAUTHORIZED).end();
    }
  }
}

export default new Routes().router;
