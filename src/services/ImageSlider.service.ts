import { ImageSliderEntity } from '../entity/ImageSlider.entity';
import { ImageSliderTranslationEntity } from '../entity/ImageSliderTranslation.Entity';
import { IImageSlider, IImageSliderDto } from '../interface/image-slider.interface';
import { ImageSliderRepository } from '../repository/ImageSlider.repository';
import { CreateFile } from './ManageFile.service';

export class ImageSliderService {
    imageSlideRepository: ImageSliderRepository;

    constructor(imageSlideRepository: ImageSliderRepository) {
        this.imageSlideRepository = imageSlideRepository;
    }

    async getImageSliders(langCode?: string): Promise<IImageSlider[]> {
        return await this.imageSlideRepository.findLocaleImageSlide(langCode);
    }

    async saveImageSlider(imageSliderDto: IImageSliderDto): Promise<ImageSliderEntity[]> {
        const imageSliderTranslationEntity: ImageSliderTranslationEntity = new ImageSliderTranslationEntity();
        imageSliderTranslationEntity.title = imageSliderDto.title;
        imageSliderTranslationEntity.langCode = imageSliderDto.langCode;
        imageSliderTranslationEntity.description = imageSliderDto.description;
        await imageSliderTranslationEntity.save();

        const fileData = await CreateFile(imageSliderDto.base64);
        const imageSliderEntity: ImageSliderEntity = new ImageSliderEntity();

        if (imageSliderEntity.translations) {
            imageSliderEntity.translations.push(imageSliderTranslationEntity);
        } else {
            imageSliderEntity.translations = [imageSliderTranslationEntity];
        }

        imageSliderEntity.filePath = fileData.filePath;
        await imageSliderEntity.save();

        return await ImageSliderEntity.find();
    }
}
