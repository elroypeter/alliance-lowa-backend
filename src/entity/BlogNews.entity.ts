import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IBlogNews } from '../interface/career-news.interface';
import { Translatable } from '../locale/locale-types';
import { BlogNewsTranslationEntity } from './BlogNewsTranslation.entity';
import { PublishStatusEntity } from './Publish.entity';

@Entity('blog-news')
export class BlogNewsEntity extends BaseEntity implements Translatable<IBlogNews> {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    filePath: string;

    @OneToOne(() => PublishStatusEntity, (isPublished) => isPublished.status)
    @JoinColumn()
    isPublished: PublishStatusEntity;

    @OneToMany(() => BlogNewsTranslationEntity, (translation) => translation.base)
    translations: BlogNewsTranslationEntity[];

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}
