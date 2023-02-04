import * as express from 'express';
import * as passport from 'passport';
import FederatedCredential from '../models/FederatedCredential';
import User from '../models/User';
import { AppSettings } from '../appSettings';
import { Logger } from '../logger/logger';
import { Strategy } from 'passport-google-oauth20';
import { Constants } from '../util/constants';
import { StatusCodes } from 'http-status-codes';

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
                        this.logger.error(err);
                        return cb(err);
                      });
                  })
                  .catch((err) => {
                    this.logger.error(err);
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
                    this.logger.error(err);
                    return cb(err);
                  });
              }
            })
            .catch((err) => {
              this.logger.error(err);
              return cb(err);
            });
        }
      )
    );

    passport.serializeUser((user, cb) => {
      process.nextTick(() => {
        cb(null, {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
        });
      });
    });

    passport.deserializeUser((user: any, cb) => {
      process.nextTick(() => {
        return cb(null, user);
      });
    });
  }

  private routes(): void {
    this.router.get('/authenticated', (req, res, next) => {
      if (req.isAuthenticated()) {
        res.status(StatusCodes.OK).end();
      }
      res.status(StatusCodes.UNAUTHORIZED).end();
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

    this.router.get('/logout', (req, res, next) => {
      req.logout((err) => {
        if (err) {
          this.logger.error(err);
          return next(err);
        }
        res.redirect('/');
      });
    });
  }
}

export default new AuthRoutes().router;
