import * as dotenv from 'dotenv';
dotenv.config();

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as session from 'express-session';
import * as passport from 'passport';
import * as morgan from 'morgan';
import { AppSettings } from './appSettings';
import { Logger } from './logger/logger';
import Database from './util/database';
import Routes from './routes/routes';
import Auth from './routes/auth';

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const PORT = 3080;

class App {
  public express: express.Application;
  public logger: Logger;

  // array to hold users
  public users: any[];

  constructor() {
    this.express = express();
    Database.initSql();
    this.middleware();
    this.routes();
    this.listen();
    this.users = [];
    this.logger = new Logger();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(morgan('combined'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(
      session({
        secret: process.env.EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new SequelizeStore({
          db: Database.sequelize,
        }),
        cookie: {
          // Session expires after 1 min of inactivity.
          maxAge: 30/*days*/ * 24/*hours*/ * 60/*minute*/ * 60/*seconds*/ * 1000/*milliseconds*/,
        },
      })
    );
    this.express.use(express.static(AppSettings.MAIN_CLIENT_PATH));
    this.express.enable('trust proxy');
    this.express.use(passport.session());
  }

  private routes(): void {
    // auth routes
    this.express.use('/', Auth);

    // user route
    this.express.use('/api', Routes);

    // TEST
    this.express.get('/sql', (req, res, next) => {
      Database.testSql();
      res.json({ success: true });
    });

    // show Vue frontend
    // Do not do a global check for authentication. Be page selective.
    this.express.get('/dashboard', this.checkAuthentication, (req, res, next) => {
      res.sendFile(AppSettings.MAIN_CLIENT_HTML);
    });

    this.express.get('/*', (req, res, next) => {
      res.sendFile(AppSettings.MAIN_CLIENT_HTML);
    });

    // handle undefined routes
    this.express.use('*', (req, res, next) => {
      res.send('Make sure url is correct!!!');
    });
  }

  private checkAuthentication(
    req: any,
    res: any,
    next: express.NextFunction
  ): void {
    console.log('in check auth');
    if (req.isAuthenticated()) {
      console.log('calling next');
      next();
    } else {
      console.log('redirecting to login');
      res.redirect('/login');
    }
  }

  // start server
  private listen(): void {
    this.express.listen(process.env.PORT || PORT, () => {
      console.log(`Listening on ${process.env.PORT || PORT}`);
    });
  }
}

export default new App().express;
