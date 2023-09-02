import { Model, Column, DataType, Table } from 'sequelize-typescript';

interface EventsCreationAttrs {
    title: string
    description: string
    authorId: number
    imageUrl: string
    formId: number
}

@Table({ tableName: 'events' })
export class Event extends Model<Event, EventsCreationAttrs> {
    @Column({ type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true, allowNull: false })
        id: number;

    @Column({ type: DataType.STRING, allowNull: false })
        title: string;

    @Column({ type: DataType.STRING, allowNull: false })
        description: string;

    @Column({ type: DataType.STRING, allowNull: true })
        imageUrl: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
        authorId: number;

    @Column({ type: DataType.DATE, allowNull: false })
        eventStartDate: number;

    @Column({ type: DataType.DATE, allowNull: false })
        eventExpirationDate: number;

    @Column({ type: DataType.DATE, allowNull: false })
        regStartDate: number;

    @Column({ type: DataType.DATE, allowNull: false })
        regExpirationDate: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
        duration: number;

    @Column({ type: DataType.INTEGER, defaultValue: 0 })
        memberAmount: number;

    @Column({ type: DataType.INTEGER, defaultValue: 0 })
        visitors: number;

    // @Column({ type: DataType.STRING, allowNull: false })
    //     category: number;
    //
    // @Column({ type: DataType.JSON, allowNull: true })
    //     tags: string;

    @Column({ type: DataType.INTEGER, allowNull: true })
        formId: number;
}
