import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { IUser } from '../interface/user.interface';

@Entity('users', {})
@Unique(['email'])
export class UserEntity extends BaseEntity implements IUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ default: null })
    passwordResetCode: string;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}
