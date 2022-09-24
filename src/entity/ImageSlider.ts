import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Entity()
export class ImageSlider extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    title: string;

    @Column({ length: 255 })
    image: string;

    @Column({ length: 255 })
    filePath: string;

    @Column({ type: "boolean", default: false })
    isPublished: boolean;

    @Column({ type: "text" })
    description: string;
}
