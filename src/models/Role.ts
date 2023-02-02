import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import OrganizationUserRole from './OrganizationUserRole';

@Table({
  timestamps: false,
  modelName: 'Role',
})
export default class Role extends Model {
  @Column(DataType.ENUM('Admin', 'Member'))
  name: string;

  @HasMany(() => OrganizationUserRole)
  organizationUserRoles: OrganizationUserRole[];
}
