import * as dotenv from 'dotenv';
dotenv.config();

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as path from 'path';
import { Logger } from './logger/logger';
import Routes from './routes/routes';
import { Sequelize } from 'sequelize-typescript';
import User from './models/User';

const PORT = 3080;

class App {
    public express: express.Application;
    public logger: Logger;
    public sequelize: Sequelize;

    // array to hold users
    public users: any[];

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.initSql();
        this.listen();
        this.users = [];
        this.logger = new Logger();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(
            express.static(path.join(__dirname, '../client/dist'))
        );
    }

    private routes(): void {
        // user route
        this.express.use('/api', Routes);

        this.express.get('/sql', (req, res, next) => {
          this.testSql();
          res.json({success: true});
        });

        this.express.get('/*', (req, res, next) => {
            res.sendFile(
                path.join(__dirname, '../client/dist/index.html')
            );
        });

        // handle undefined routes
        this.express.use('*', (req, res, next) => {
            res.send('Make sure url is correct!!!');
        });
    }

    private listen(): void {
        this.express.listen(process.env.PORT || PORT, () => {
            console.log(`Listening on ${process.env.PORT || PORT}`);
        });
    }

    private initSql(): void {
      // https://www.npmjs.com/package/sequelize-typescript
      this.sequelize = new Sequelize({
        host: process.env.MYSQL_DB_HOST,
        database: process.env.MYSQL_DB_DATABASE,
        dialect: 'mariadb',
        username: process.env.MYSQL_DB_USERNAME,
        password: process.env.MYSQL_DB_PASSWORD,
        models: [__dirname + '/models'],
      });
      this.sequelize
        .sync()
        .then(result => {
          console.log(result);
        })
        .catch(err => {
          console.log(err);
        });
    }

    private testSql(): void {
      const user = User.create({
        username: 'reponzo01',
        age: 40,
      });
      //user.save();
    }
}

export default new App().express;
