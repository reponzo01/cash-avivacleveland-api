import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  AllowNull,
} from 'sequelize-typescript';
import User from './User';

@Table({
  timestamps: true,
  modelName: 'FederatedCredential',
})
export default class FederatedCredential extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @AllowNull(false)
  @Column
  provider: string;

  @AllowNull(false)
  @Column
  federatedProviderId: string;

  @BelongsTo(() => User)
  user: User;
}
