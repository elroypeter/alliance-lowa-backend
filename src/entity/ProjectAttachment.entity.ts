import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectEntity } from './Project.entity';

@Entity('project-attachment')
export class ProjectAttachmentEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 200 })
    filePath: string;

    @Column({ type: 'bool' })
    isVideo: boolean;

    @ManyToOne(() => ProjectEntity, (project) => project.attachments, { onDelete: 'CASCADE' })
    project: ProjectEntity;
}
