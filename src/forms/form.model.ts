import { Column, DataType, Model, Table } from 'sequelize-typescript';
// import { Event } from 'events/event.model';
// import { FormEvents } from 'forms/form-events.model';

interface FormCreationAttrs {
    userId: number
    content: string
}
@Table({ tableName: 'forms' })
export class Form extends Model<Form, FormCreationAttrs> {
    @Column({ type: DataType.INTEGER, unique: true, primaryKey: true, allowNull: false, autoIncrement: true })
        id: number;

    @Column({ type: DataType.INTEGER, unique: true, allowNull: false })
        userId: number;

    @Column({ type: DataType.JSON, allowNull: false })
        content: JSON;

    // @BelongsToMany(() => Event, () => FormEvents)
    //     events: Event[];
}
