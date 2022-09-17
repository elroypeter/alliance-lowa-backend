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

    @Column({ type: "longtext" })
    imageData: string;

    @ManyToOne(() => Project, (project) => project.images)
    project: Project;
}
