import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne } from 'typeorm';
import { ICareer } from '../interface/career-news.interface';
import { PublishStatusEntity } from './Publish.entity';

@Entity('career')
export class CareerEntity extends BaseEntity implements ICareer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    title: string;

    @Column({ length: 255 })
    slug: string;

    @Column({ type: 'text' })
    description: string;

    @OneToOne(() => PublishStatusEntity, (isPublished) => isPublished.status)
    @JoinColumn()
    isPublished: PublishStatusEntity;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}
