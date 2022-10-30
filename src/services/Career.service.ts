import { Context } from 'koa';
import slugify from 'slugify';
import { CareerEntity } from '../entity/Career.entity';
import { PublishStatusEntity } from '../entity/Publish.entity';
import { ResponseCode } from '../enums/response.enums';
import { ICareer, ICareerDto } from '../interface/career-news.interface';
import { ResponseService } from './Response.service';

export class CareerService {
    async findAllCareer(): Promise<ICareer[]> {
        return await CareerEntity.find({ relations: ['isPublished'] });
    }

    async findOneCareer(ctx: Context, id): Promise<CareerEntity> {
        const career = await CareerEntity.findOne({ where: { id } });
        if (!career) {
            ResponseService.throwReponseException(ctx, 'Career with id not found', ResponseCode.BAD_REQUEST);
            return career;
        }
        return career;
    }

    async saveCareer(careerDto: ICareerDto): Promise<CareerEntity[]> {
        const publishStatusEntity: PublishStatusEntity = new PublishStatusEntity();
        publishStatusEntity.entity = 'CareerEntity';
        publishStatusEntity.status = false;
        await publishStatusEntity.save();

        const career = new CareerEntity();
        career.title = careerDto.title;
        career.description = careerDto.description;
        career.slug = slugify(careerDto.title, { lower: true });
        career.isPublished = publishStatusEntity;
        await career.save();
        return await CareerEntity.find({ relations: ['isPublished'] });
    }

    async deleteCareer(ctx: Context, id: number): Promise<CareerEntity> {
        const career: CareerEntity = await CareerEntity.findOne({ where: { id } });
        if (!career) {
            ResponseService.throwReponseException(ctx, 'Career with id not found', ResponseCode.BAD_REQUEST);
            return career;
        }
        await CareerEntity.delete(career.id);
        return career;
    }

    async updateCareer(ctx: Context, careerDto: ICareerDto, id: number): Promise<CareerEntity> {
        const careerEntity: CareerEntity = await CareerEntity.findOne({ where: { id } });
        if (!careerEntity) {
            ResponseService.throwReponseException(ctx, 'Career with id not found', ResponseCode.BAD_REQUEST);
            return careerEntity;
        }

        if (careerDto.title) careerDto.slug = slugify(careerDto.title, { lower: true });
        await CareerEntity.getRepository().update({ id: careerEntity.id }, { ...careerDto });
        return careerEntity;
    }

    async changePublishStatus(ctx: Context, status: boolean, id: number): Promise<CareerEntity> {
        const careerEntity: CareerEntity = await CareerEntity.findOne({ where: { id }, relations: ['isPublished'] });
        if (!careerEntity) {
            ResponseService.throwReponseException(ctx, 'Career with id not found', ResponseCode.BAD_REQUEST);
            return careerEntity;
        }
        await PublishStatusEntity.getRepository().update({ id: careerEntity.isPublished.id }, { status });
        return careerEntity;
    }
}
