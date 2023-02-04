import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  AllowNull,
} from 'sequelize-typescript';
import OrganizationUserRole from './OrganizationUserRole';

@Table({
  timestamps: false,
  modelName: 'Role',
})
export default class Role extends Model {
  @AllowNull(false)
  @Column(DataType.ENUM('Admin', 'Member'))
  name: string;

  @HasMany(() => OrganizationUserRole)
  organizationUserRoles: OrganizationUserRole[];
}
