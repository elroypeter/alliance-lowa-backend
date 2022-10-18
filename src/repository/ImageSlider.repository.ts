import { ImageSliderEntity } from '../entity/ImageSlider.entity';
import { IImageSlider } from '../interface/image-slider.interface';
import { translate } from '../locale/locale.service';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

export class ImageSliderRepository extends Repository<ImageSliderEntity> {
    constructor(dataSource: DataSource) {
        super(ImageSliderEntity, dataSource.createEntityManager());
    }

    async findLocaleImageSlide(langCode: string): Promise<IImageSlider[]> {
        return this.translateImageSlide(await this.getImageSliderQuery(langCode).getMany());
    }

    private getImageSliderQuery(langCode: string): SelectQueryBuilder<ImageSliderEntity> {
        const code = langCode || 'en';
        return this.manager.createQueryBuilder(ImageSliderEntity, 'image_slider').leftJoinAndSelect('image_slider.translations', 'image_translation').where('image_translation.langCode = :code', { code });
    }

    private translateImageSlide(result: ImageSliderEntity[]): IImageSlider[] {
        return result.map((imageSliderEntity: ImageSliderEntity) => translate<IImageSlider>(imageSliderEntity));
    }
}
