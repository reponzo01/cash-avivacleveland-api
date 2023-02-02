import { Sequelize } from 'sequelize-typescript';
import { Logger } from '../logger/logger';
import FederatedCredential from '../models/FederatedCredential';
import Role from '../models/Role';
import User from '../models/User';

const roles: string[] = ['Admin', 'Member'];

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
    this.sequelize.addModels([User, FederatedCredential, Role]);
    this.sequelize
      .sync()
      .then((result) => {
        this.seedRoles();
      })
      .catch((err) => {
        this.logger.error(err);
      });
  }

  public testSql(): void {
    const user = User.create({
      username: 'reponzo01',
      age: 40,
    });
  }

  private seedRoles(): void {
    for (const roleToCheck of roles) {
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
