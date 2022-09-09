import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Entity()
export class Subscriber extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 255 })
    email: string
}