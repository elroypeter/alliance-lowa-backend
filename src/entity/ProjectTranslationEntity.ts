import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IProject } from '../interface/project.interface';
import { Translation } from '../locale/locale-types';
import { ProjectEntity } from './Project.entity';

@Entity('project-translation')
export class ProjectTranslationEntity extends BaseEntity implements Translation<IProject> {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    langCode: string;

    @Column()
    slug: string;

    @Column()
    title: string;

    @Column({ type: 'text' })
    description: string;

    @ManyToOne(() => ProjectEntity, (slider) => slider.translations, { onDelete: 'CASCADE' })
    base: ProjectEntity;
}
