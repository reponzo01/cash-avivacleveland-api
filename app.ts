import * as dotenv from 'dotenv';
dotenv.config();

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as path from 'path';
import * as session from 'express-session';
import * as passport from 'passport';
import { Logger } from './logger/logger';
import Database from './util/database';
import Routes from './routes/routes';
import Auth from './routes/auth';

const PORT = 3080;

class App {
  public express: express.Application;
  public logger: Logger;

  // array to hold users
  public users: any[];

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    Database.initSql();
    this.listen();
    this.users = [];
    this.logger = new Logger();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(express.static(path.join(__dirname, '../client/dist')));
    this.express.use(
      session({
        secret: process.env.EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
      })
    );
    this.express.use(passport.session());
  }

  private routes(): void {
    // auth routes
    this.express.use('/', Auth);

    // user route
    this.express.use('/api', Routes);

    this.express.get('/sql', (req, res, next) => {
      Database.testSql();
      res.json({ success: true });
    });

    // show Vue frontend
    this.express.get('/*', (req, res, next) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });

    // handle undefined routes
    this.express.use('*', (req, res, next) => {
      res.send('Make sure url is correct!!!');
    });
  }

  // start server
  private listen(): void {
    this.express.listen(process.env.PORT || PORT, () => {
      console.log(`Listening on ${process.env.PORT || PORT}`);
    });
  }
}

export default new App().express;
