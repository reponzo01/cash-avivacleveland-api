import FederatedCredential from '../models/FederatedCredential';
import Organization from '../models/Organization';
import OrganizationUserRole from '../models/OrganizationUserRole';
import Role from '../models/Role';
import User from '../models/User';
import { Constants } from './constants';
import { Logger } from '../logger/logger';
import { Sequelize } from 'sequelize-typescript';

class Database {
  public sequelize: Sequelize;
  public logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  public initSql(): void {
    // https://www.npmjs.com/package/sequelize-typescript
    this.sequelize = new Sequelize({
      host: process.env.MYSQL_DB_HOST,
      database: process.env.MYSQL_DB_DATABASE,
      dialect: 'mariadb',
      dialectModule: require('mariadb'),
      username: process.env.MYSQL_DB_USERNAME,
      password: process.env.MYSQL_DB_PASSWORD,
    });
    this.sequelize.addModels([
      User,
      FederatedCredential,
      Role,
      Organization,
      OrganizationUserRole,
    ]);
    this.sequelize
      .sync()
      .then((result) => {
        this.seedRoles();
      })
      .catch((err) => {
        this.logger.error(err);
      });
  }

  private seedRoles(): void {
    for (const roleToCheck of Constants.ROLES) {
      Role.findOne({
        where: {
          name: roleToCheck,
        },
      })
        .then((role) => {
          if (role == null) {
            Role.create({
              name: roleToCheck,
            }).catch((err) => {
              this.logger.error(err);
            });
          }
        })
        .catch((err) => {
          this.logger.error(err);
        });
    }
  }
}

export default new Database();
