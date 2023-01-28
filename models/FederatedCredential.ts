import {Table, Column, Model, ForeignKey, BelongsTo} from 'sequelize-typescript';
import User from './User';

@Table({
  timestamps: true,
})
export default class FederatedCredential extends Model {

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column
  federatedProviderId: string;

  @BelongsTo(() => User)
  user: User;
}