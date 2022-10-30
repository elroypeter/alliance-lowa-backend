import { ImageSliderEntity } from '../entity/ImageSlider.entity';
import { IImageSlider } from '../interface/image-slider.interface';
import { translate } from '../locale/locale.service';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

export class ImageSliderRepository extends Repository<ImageSliderEntity> {
    constructor(dataSource: DataSource) {
        super(ImageSliderEntity, dataSource.createEntityManager());
    }

    async findLocaleImageSlide(langCode: string | undefined, pubStatus?: boolean): Promise<IImageSlider[]> {
        if (pubStatus) {
            return this.transformPublishStatus(
                this.translateImageSlide(
                    await this.getImageSliderQuery(langCode)
                        .andWhere('publishStatus.entity = :entityI', { entityI: 'ImageSliderEntity' })
                        .andWhere('publishStatus.status = :pubStatus', { pubStatus })
                        .getMany(),
                ),
            );
        }
        return this.transformPublishStatus(this.translateImageSlide(await this.getImageSliderQuery(langCode).getMany()));
    }

    private getImageSliderQuery(langCode: string | undefined): SelectQueryBuilder<ImageSliderEntity> {
        const code = langCode || 'en';
        return this.manager
            .createQueryBuilder(ImageSliderEntity, 'imageSlider')
            .leftJoinAndSelect('imageSlider.isPublished', 'publishStatus')
            .leftJoinAndSelect('imageSlider.translations', 'imageTranslation')
            .where('imageTranslation.langCode = :code', { code });
    }

    private translateImageSlide(result: ImageSliderEntity[]): IImageSlider[] {
        return result.map((imageSliderEntity: ImageSliderEntity) => translate<IImageSlider>(imageSliderEntity));
    }

    private transformPublishStatus(result: IImageSlider[]): IImageSlider[] {
        return result.map((imageSlider: IImageSlider) => {
            if (typeof imageSlider.isPublished !== 'boolean') {
                imageSlider.isPublished = imageSlider.isPublished.status;
            }
            return imageSlider;
        });
    }
}
