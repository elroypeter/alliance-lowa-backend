import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { IUser } from "../interface/user.interface";

@Entity('user')
export class UserEntity extends BaseEntity implements IUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ length: 255 })
    email: string;

    @Column({ length: 255 })
    password: string;
}
