import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface RegCreationAttrs {
    eventId: number
    regList: string
}
@Table({ tableName: 'regs' })
export class Reg extends Model<Reg, RegCreationAttrs> {
    @Column({ type: DataType.INTEGER, unique: true, primaryKey: true, allowNull: false })
        eventId: number;

    @Column({ type: DataType.ARRAY(DataType.JSON), allowNull: true })
        regList: JSON;
}
