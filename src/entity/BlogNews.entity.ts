import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { IBlogNews } from "../interface/career-news.interface";
import { Translatable } from "../locale/locale-types";
import { BlogNewsTranslationEntity } from "./BlogNewsTranslation.entity";
import { PublishStatusEntity } from "./Publish.entity";

@Entity('blog-news')
export class BlogNewsEntity extends BaseEntity implements Translatable<IBlogNews>{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    imageName: string;

    @Column({ length: 255 })
    filePath: string;

    @OneToOne(() => PublishStatusEntity, isPublished => isPublished.status)
    @JoinColumn()
    isPublished: PublishStatusEntity

    @OneToMany(() => BlogNewsTranslationEntity, translation => translation.base)
    translations: BlogNewsTranslationEntity[]
}