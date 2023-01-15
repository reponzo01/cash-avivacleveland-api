import * as dotenv from 'dotenv';
dotenv.config();

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as path from 'path';
import { Logger } from './logger/logger';
import Routes from './routes/routes';

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
        this.express.get('/', (req, res, next) => {
            res.sendFile(
                path.join(__dirname, '../client/dist/index.html')
            );
        });

        // user route
        this.express.use('/api', Routes);

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
}

export default new App().express;
