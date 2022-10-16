import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Entity('subcriber')
export class SubscriberEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 255 })
    email: string
}