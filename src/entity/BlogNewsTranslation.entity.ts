import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IBlogNews } from '../interface/career-news.interface';
import { Translation } from '../locale/locale-types';
import { BlogNewsEntity } from './BlogNews.entity';

@Entity('blog-news-translation')
export class BlogNewsTranslationEntity extends BaseEntity implements Translation<IBlogNews> {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    langCode: string;

    @Column()
    title: string;

    @Column()
    slug: string;

    @Column({ type: 'text' })
    description: string;

    @ManyToOne(() => BlogNewsEntity, (blog) => blog.translations)
    base: BlogNewsEntity;
}
