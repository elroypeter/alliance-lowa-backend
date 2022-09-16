import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Entity()
export class ImageSlider extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    title: string;

    @Column({ type: "longtext" })
    image: string;

    @Column({ type: "boolean", default: false })
    isPublished: boolean;

    @Column({ type: "text" })
    description: string;
}
