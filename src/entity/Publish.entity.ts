import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('publish-status')
export class PublishStatusEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 200})
    entity: string;

    @Column({type: "bool", default: false})
    status: boolean
}