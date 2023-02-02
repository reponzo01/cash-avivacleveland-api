import {Table, Column, Model, DataType} from 'sequelize-typescript';

@Table({
  timestamps: false,
  modelName: 'Role'
})
export default class Role extends Model {

  @Column(DataType.ENUM('Admin', 'Member'))
  name: string;
}