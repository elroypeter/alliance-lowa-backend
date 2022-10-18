import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IUser } from '../interface/user.interface';

@Entity('users')
export class UserEntity extends BaseEntity implements IUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ length: 255 })
    email: string;

    @Column({ length: 255 })
    password: string;

    @Column({ length: 255, default: null })
    passwordResetCode: string;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}
