import { Context } from 'koa';
import { ResponseCode } from '../enums/response.enums';
import { ImageSliderEntity } from '../entity/ImageSlider.entity';
import { ImageSliderTranslationEntity } from '../entity/ImageSliderTranslation.Entity';
import { IImageSlider, IImageSliderDto } from '../interface/image-slider.interface';
import { PublishStatusEntity } from '../entity/Publish.entity';
import { ImageSliderRepository } from '../repository/ImageSlider.repository';
import { CreateFile } from './ManageFile.service';
import { ResponseService } from './Response.service';

export class ImageSliderService {
    imageSlideRepository: ImageSliderRepository;

    constructor(imageSlideRepository: ImageSliderRepository) {
        this.imageSlideRepository = imageSlideRepository;
    }

    async getImageSliders(langCode?: string, isPulished?: boolean): Promise<IImageSlider[]> {
        return await this.imageSlideRepository.findLocaleImageSlide(langCode, isPulished);
    }

    async saveImageSlider(imageSliderDto: IImageSliderDto): Promise<ImageSliderEntity[]> {
        const imageSliderTranslationEntity: ImageSliderTranslationEntity = new ImageSliderTranslationEntity();
        imageSliderTranslationEntity.title = imageSliderDto.title;
        imageSliderTranslationEntity.langCode = imageSliderDto.langCode;
        imageSliderTranslationEntity.description = imageSliderDto.description;
        await imageSliderTranslationEntity.save();

        const publishStatusEntity: PublishStatusEntity = new PublishStatusEntity();
        publishStatusEntity.entity = 'ImageSliderEntity';
        publishStatusEntity.status = false;
        await publishStatusEntity.save();

        const fileData = await CreateFile(imageSliderDto.base64);
        const imageSliderEntity: ImageSliderEntity = new ImageSliderEntity();

        imageSliderEntity.translations = [imageSliderTranslationEntity];
        imageSliderEntity.isPublished = publishStatusEntity;
        imageSliderEntity.filePath = fileData.filePath;
        await imageSliderEntity.save();

        return await ImageSliderEntity.find({ relations: ['isPublished', 'translations'] });
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

    async updateImageSliderTranslation(ctx: Context, imageSliderDto: IImageSliderDto, id: number): Promise<ImageSliderTranslationEntity> {
        const imageSliderTranslationEntity: ImageSliderTranslationEntity = await ImageSliderTranslationEntity.findOne({ where: { id } });
        if (!imageSliderTranslationEntity) {
            ResponseService.throwReponseException(ctx, 'Imageslider Translation with id not found', ResponseCode.BAD_REQUEST);
            return imageSliderTranslationEntity;
        }

        await ImageSliderTranslationEntity.getRepository().update({ id: imageSliderTranslationEntity.id }, { ...imageSliderDto });
        return imageSliderTranslationEntity;
    }

    async changePublishStatus(ctx: Context, status: boolean, id: number): Promise<ImageSliderEntity> {
        const imageSliderEntity: ImageSliderEntity = await ImageSliderEntity.findOne({ where: { id }, relations: ['isPublished'] });
        if (!imageSliderEntity) {
            ResponseService.throwReponseException(ctx, 'Imageslider with id not found', ResponseCode.BAD_REQUEST);
            return imageSliderEntity;
        }
        await PublishStatusEntity.getRepository().update({ id: imageSliderEntity.isPublished.id }, { status });
        return imageSliderEntity;
    }

    async deleteImageSlider(ctx: Context, id: number): Promise<ImageSliderEntity> {
        const imageSliderEntity: ImageSliderEntity = await ImageSliderEntity.findOne({ where: { id } });
        if (!imageSliderEntity) {
            ResponseService.throwReponseException(ctx, 'Imageslider with id not found', ResponseCode.BAD_REQUEST);
            return imageSliderEntity;
        }
        await ImageSliderEntity.delete(imageSliderEntity.id);
        return imageSliderEntity;
    }
}
