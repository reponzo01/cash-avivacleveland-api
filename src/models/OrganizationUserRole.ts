import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import Organization from './Organization';
import Role from './Role';
import User from './User';

@Table({
  timestamps: true,
  modelName: 'OrganizationUserRole',
})
export default class OrganizationUserRole extends Model {
  @ForeignKey(() => Organization)
  @Column
  organizationId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Role)
  @Column
  roleId: number;

  @BelongsTo(() => Organization)
  organization: Organization;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Role)
  role: Role;
}
