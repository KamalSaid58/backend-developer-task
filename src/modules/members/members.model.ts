import {
  Table,
  Column,
  DataType,
  PrimaryKey,
  Model,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';

@Table({ tableName: 'members' })
export class Member extends Model<Member> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  firstName: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  lastName: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  gender: string;

  @Column({ type: DataType.STRING, allowNull: false })
  dateOfBirth: string; // Format: DD-MM-YYYY

  @Column({ type: DataType.STRING(255), allowNull: true })
  phone?: string;

  @ForeignKey(() => Member)
  @Column({ type: DataType.UUID, allowNull: true })
  centralMemberId?: string; // Reference to central member (if this is a family member)

  @BelongsTo(() => Member, 'centralMemberId')
  centralMember?: Member;

  @HasMany(() => Member, 'centralMemberId')
  familyMembers?: Member[]; // Family members linked to this central member
}
