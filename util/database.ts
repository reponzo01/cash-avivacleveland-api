import path = require('path');
import { Sequelize } from 'sequelize-typescript';
import User from '../models/User';

class Database {
  public sequelize: Sequelize;

  public initSql(): void {
    // https://www.npmjs.com/package/sequelize-typescript
    this.sequelize = new Sequelize({
      host: process.env.MYSQL_DB_HOST,
      database: process.env.MYSQL_DB_DATABASE,
      dialect: 'mariadb',
      username: process.env.MYSQL_DB_USERNAME,
      password: process.env.MYSQL_DB_PASSWORD,
      models: [path.join(__dirname, '../models')],
    });
    this.sequelize
      .sync()
      .then(result => {
        // console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  public testSql(): void {
    const user = User.create({
      username: 'reponzo01',
      age: 40,
    });
    //user.save();
  }
}

export default new Database();