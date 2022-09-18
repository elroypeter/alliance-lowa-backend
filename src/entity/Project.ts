import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    OneToMany,
} from "typeorm";
import { ProjectImage } from "./ProjectImage";

@Entity()
export class Project extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    slug: string;

    @Column({ length: 255 })
    title: string;

    @Column({ type: "boolean", default: false })
    isPublished: boolean;

    @Column({ type: "text" })
    description: string;

    @OneToMany(() => ProjectImage, (image) => image.project)
    images: ProjectImage[];
}
