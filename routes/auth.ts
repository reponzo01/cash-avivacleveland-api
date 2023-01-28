import * as express from 'express';
import * as passport from 'passport';
import * as path from 'path';
import { Logger } from '../logger/logger';
import { Strategy } from 'passport-google-oauth20';

declare global {
  namespace Express {
    interface User {
      name: string;
      username: string;
      id?: number | undefined;
    }
  }
}

class Auth {
  public router: express.Router;
  public logger: Logger;

  constructor() {
    this.router = express.Router();
    this.initPassport();
    this.routes();
    this.logger = new Logger();
  }

  private initPassport(): void {
    const GoogleStrategy = Strategy;
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: '/oauth2/redirect/google',
          scope: ['profile', 'email'],
        },
        function (accessToken, refreshToken, profile, cb) {
          console.log(profile);
          var user = {
            id: 5,
            name: profile.displayName,
            username: 'test',
          };
          cb(null, user);
        }
      )
    );

    passport.serializeUser(function (user, cb) {
      console.log('serializing user');
      console.log(user);
      process.nextTick(function () {
        cb(null, { id: user.id, username: user.username, name: user.name });
      });
    });

    passport.deserializeUser(function (user: any, cb) {
      process.nextTick(function () {
        return cb(null, user);
      });
    });
  }

  private routes(): void {
    this.router.get('/login', (req, res, next) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });

    this.router.get('/login/federated/google', passport.authenticate('google'));

    this.router.get(
      '/oauth2/redirect/google',
      passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login',
      })
    );

    this.router.post('/logout', function (req, res, next) {
      req.logout(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
  }
}

export default new Auth().router;
