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

class AuthRoutes {
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
          FederatedCredential.findOne({
            include: [User],
            where: {
              provider: profile.provider,
              federatedProviderId: profile.id,
            },
          })
            .then((federatedCredential) => {
              if (federatedCredential == null) {
                User.create({
                  username: profile.emails[0].value,
                  name: profile.displayName,
                  email: profile.emails[0].value,
                  avatarUrl: profile.photos[0].value,
                  isFederated: true,
                })
                  .then((createdUser) => {
                    FederatedCredential.create({
                      userId: createdUser.id,
                      provider: profile.provider,
                      federatedProviderId: profile.id,
                    })
                      .then(() => {
                        const user: Express.User = {
                          id: createdUser.id,
                          name: createdUser.name,
                          username: createdUser.username,
                          avatarUrl: createdUser.avatarUrl,
                          email: createdUser.email,
                        };
                        return cb(null, user);
                      })
                      .catch((err) => {
                        console.log(err);
                        return cb(err);
                      });
                  })
                  .catch((err) => {
                    console.log(err);
                    return cb(err);
                  });
              } else {
                User.findOne({
                  where: {
                    id: federatedCredential.userId,
                  },
                })
                  .then((foundUser) => {
                    return cb(null, foundUser);
                  })
                  .catch((err) => {
                    console.log(err);
                    return cb(err);
                  });
              }
            })
            .catch((err) => {
              console.log(err);
              return cb(err);
            });
        }
      )
    );

    passport.serializeUser(function (user, cb) {
      process.nextTick(function () {
        cb(null, {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
        });
      });
    });

    passport.deserializeUser(function (user: any, cb) {
      process.nextTick(function () {
        return cb(null, user);
      });
    });
  }

  private routes(): void {
    this.router.get('/authenticated', (req, res, next) => {
      if (req.isAuthenticated()) {
        res.status(AppSettings.HTTP_STATUS_OK).end();
      }
      res.status(AppSettings.HTTP_STATUS_UNAUTHORIZED).end();
    });

    this.router.get('/login', (req, res, next) => {
      res.sendFile(AppSettings.MAIN_CLIENT_HTML);
    });

    this.router.get('/login/federated/google', passport.authenticate('google'));

    this.router.get(
      '/oauth2/redirect/google',
      passport.authenticate('google', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
      })
    );

    this.router.get('/logout', function (req, res, next) {
      req.logout(function (err) {
        if (err) {
          console.log(err);
          return next(err);
        }
        res.redirect('/');
      });
    });
  }
}

export default new AuthRoutes().router;
