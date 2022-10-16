import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { Translatable } from "../locale/locale-types";
import { IImageSlider } from "../interface/image-slider.interface"
import { ImageSliderTranslationEntity } from "./ImageSliderTranslation.Entity";
import { PublishStatusEntity } from "./Publish.entity";

@Entity()
export class ImageSliderEntity extends BaseEntity implements Translatable<IImageSlider> {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    imageName: string;

    @Column({ length: 255 })
    filePath: string;

    @OneToOne(() => PublishStatusEntity, isPublished => isPublished.status)
    @JoinColumn()
    isPublished: PublishStatusEntity

    @OneToMany(() => ImageSliderTranslationEntity, translation => translation.base)
    translations: ImageSliderTranslationEntity[]
}
