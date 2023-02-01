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
    this.express.use('/', Routes);
  }

  // start server
  private listen(): void {
    this.express.listen(process.env.PORT || PORT, () => {
      console.log(`Listening on ${process.env.PORT || PORT}`);
    });
  }
}

export default new App().express;
