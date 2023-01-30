import {Table, Column, Model, HasMany} from 'sequelize-typescript';
import FederatedCredential from './FederatedCredential';

@Table({
  timestamps: true,
  modelName: 'User'
})
export default class User extends Model {

  @Column
  username: string;

  @Column
  hashedPassword: Buffer;

  @Column
  salt: Buffer;

  @Column
  name: string;

  @Column
  email: string;

  @Column
  emailVerified: string;

  @Column
  isFederated: boolean;

  @HasMany(() => FederatedCredential)
  federatedCredentials: FederatedCredential[];
}