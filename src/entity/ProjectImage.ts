import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    ManyToOne,
} from "typeorm";
import { Project } from "./Project";

@Entity()
export class ProjectImage extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    imageData: string;

    @Column({ length: 255 })
    filePath: string;

    @ManyToOne(() => Project, (project) => project.images)
    project: Project;
}
