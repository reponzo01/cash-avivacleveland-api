import { Table, Column, Model } from 'sequelize-typescript';

@Table({
  timestamps: true,
  modelName: 'Organization',
})
export default class Organization extends Model {
  @Column
  name: string;

  @Column
  description: string;
}
