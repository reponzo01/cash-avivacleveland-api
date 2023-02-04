import {
  Table,
  Column,
  Model,
  HasMany,
  AllowNull,
  Default,
} from 'sequelize-typescript';
import FederatedCredential from './FederatedCredential';
import OrganizationUserRole from './OrganizationUserRole';

@Table({
  timestamps: true,
  modelName: 'User',
})
export default class User extends Model {
  @AllowNull(false)
  @Column
  username: string;

  @Column
  hashedPassword: Buffer;

  @Column
  salt: Buffer;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  email: string;

  @Column
  emailVerified: string;

  @Column
  avatarUrl: string;

  @AllowNull(false)
  @Default(false)
  @Column
  isFederated: boolean;

  @HasMany(() => FederatedCredential)
  federatedCredentials: FederatedCredential[];

  @HasMany(() => OrganizationUserRole)
  organizationUserRoles: OrganizationUserRole[];
}
