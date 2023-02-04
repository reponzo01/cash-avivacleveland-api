import { Table, Column, Model, HasMany, AllowNull } from 'sequelize-typescript';
import OrganizationUserRole from './OrganizationUserRole';

@Table({
  timestamps: true,
  modelName: 'Organization',
})
export default class Organization extends Model {
  @AllowNull(false)
  @Column
  name: string;

  @Column
  description: string;

  @HasMany(() => OrganizationUserRole)
  organizationUserRoles: OrganizationUserRole[];
}
