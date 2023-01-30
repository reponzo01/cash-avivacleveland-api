import * as express from 'express';
import * as passport from 'passport';
import { AppSettings } from '../appSettings';
import { Logger } from '../logger/logger';
import { Strategy } from 'passport-google-oauth20';
import FederatedCredential from '../models/FederatedCredential';
import User from '../models/User';

declare global {
  namespace Express {
    interface User {
      name: string;
      username: string;
      email: string;
      avatarUrl: string;
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
          // get from federatedCredential where provider and id match profile
          FederatedCredential.findOne({
            include: [User],
            where: {
              provider: profile.provider,
              federatedProviderId: profile.id
            }
          })
          .then((federatedCredential) => {
            console.log('fed cred: ', federatedCredential);
            if (federatedCredential == null) {
              console.log('fed cred is null!');
              const newUser = User.create({
                username: profile.emails[0].value,
                name: profile.displayName,
                email: profile.emails[0].value,
                avatarUrl: profile.photos[0].value,
                isFederated: true
              })
              .then((createdUser) => {
                createdUser
              });
            }
            // const user: Express.User = {
            //   id: 5,
            //   name: profile.displayName,
            //   username: 'test',
            // };
            // cb(null, user);
          })
          .catch((err) => {
            console.log(err);
            return cb(err);
          });
        }
      )
    );

    passport.serializeUser(function (user, cb) {
      console.log('serializing user: ', user);
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
      res.sendFile(AppSettings.MAIN_CLIENT_HTML);
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
