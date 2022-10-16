import {
    Entity,
    PrimaryGeneratedColumn,
    BaseEntity,
    OneToMany,
    JoinColumn,
    OneToOne
} from "typeorm";
import { IProject } from "../interface/project.interface";
import { Translatable } from "../locale/locale-types";
import { ProjectAttachmentEntity } from "./ProjectAttachment.entity";
import { ProjectTranslationEntity } from "./ProjectTranslationEntity";
import { PublishStatusEntity } from "./Publish.entity";

@Entity()
export class ProjectEntity extends BaseEntity implements Translatable<IProject> {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => ProjectAttachmentEntity, attachment => attachment.project)
    attachments: ProjectAttachmentEntity[];

    @OneToOne(() => PublishStatusEntity, isPublished => isPublished.status)
    @JoinColumn()
    isPublished: PublishStatusEntity

    @OneToMany(() => ProjectTranslationEntity, translation => translation.base)
    translations: ProjectTranslationEntity[]
}


