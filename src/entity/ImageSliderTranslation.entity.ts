import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IImageSlider } from '../interface/image-slider.interface';
import { Translation } from '../locale/locale-types';
import { ImageSliderEntity } from './ImageSlider.entity';

@Entity('image-slider-translation')
export class ImageSliderTranslationEntity extends BaseEntity implements Translation<IImageSlider> {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    langCode: string;

    @Column()
    title: string;

    @Column({ type: 'text' })
    description: string;

    @ManyToOne(() => ImageSliderEntity, (slider) => slider.translations, { onDelete: 'CASCADE' })
    base: ImageSliderEntity;
}
