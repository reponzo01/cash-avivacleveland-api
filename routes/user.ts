import * as express from "express";
import { Logger } from "../logger/logger";

class User {

    public router: express.Router;
    public logger: Logger;

    // array to hold users
    public users: any[];

    constructor() {
        this.router = express.Router();
        this.routes();
        this.users = [];
        this.logger = new Logger();
    }

    private routes(): void {

        // request to get all the users
        this.router.get("/users", (req, res, next) => {
            this.logger.info("url:::::::" + req.url);
            res.json(this.users);
        });

        // request to get all the users by userName
        this.router.get("/users/:userName", (req, res, next) => {
            this.logger.info("url:::::::" + req.url);
            const user = this.users.filter(function(user) {
                if (req.params.userName === user.userName) {
                    return user;
                }
            });
            res.json(user);
        });

        // request to post the user
        // req.body has object of type {user:{firstName:"fnam1",lastName:"lnam1",userName:"username1"}}
        this.router.post("/user", (req, res, next) => {
            this.logger.info("url:::::::" + req.url);
            this.users.push(req.body.user);
            res.json(this.users);
        });
    }
}

export default new User().router;