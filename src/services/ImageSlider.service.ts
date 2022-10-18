import { Context } from 'koa';
import { ResponseCode } from '../enums/response.enums';
import { ImageSliderEntity } from '../entity/ImageSlider.entity';
import { ImageSliderTranslationEntity } from '../entity/ImageSliderTranslation.Entity';
import { IImageSlider, IImageSliderDto } from '../interface/image-slider.interface';
import { ImageSliderRepository } from '../repository/ImageSlider.repository';
import { CreateFile } from './ManageFile.service';
import { ResponseService } from './Response.service';

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

    async addImageSliderTranslation(ctx: Context, imageSliderDto: IImageSliderDto, id: number): Promise<ImageSliderEntity> {
        const imageSliderEntity: ImageSliderEntity = await ImageSliderEntity.findOne({ where: { id }, relations: ['translations'] });
        if (!imageSliderEntity) {
            ResponseService.throwReponseException(ctx, 'Imageslider with id not found', ResponseCode.BAD_REQUEST);
            return imageSliderEntity;
        }

        const imageSliderTranslationEntity: ImageSliderTranslationEntity = new ImageSliderTranslationEntity();
        imageSliderTranslationEntity.title = imageSliderDto.title;
        imageSliderTranslationEntity.langCode = imageSliderDto.langCode;
        imageSliderTranslationEntity.description = imageSliderDto.description;
        await imageSliderTranslationEntity.save();

        imageSliderEntity.translations.push(imageSliderTranslationEntity);
        await imageSliderEntity.save();
        return imageSliderEntity;
    }
}
