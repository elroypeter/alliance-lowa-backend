import { CareerService } from '../services/Career.service';
import { App } from '../bootstrap';
import { ICareer, ICareerDto } from '../interface/career-news.interface';
import { Context } from 'koa';
import { ResponseCode } from '../enums/response.enums';
import { ResponseService } from '../services/Response.service';
import { RouteAction } from '../types/route.types';
import { CareerEntity } from '../entity/Career.entity';

class CareerController {
    careerService: CareerService;
    constructor(careerService: CareerService) {
        this.careerService = careerService;
    }

    getCareer = async (ctx: Context): Promise<RouteAction> => {
        const career: ICareer[] = await this.careerService.findAllCareer();
        ResponseService.res(ctx, ResponseCode.OK, career);
        return;
    };

    getSingleCareer = async (ctx: Context): Promise<RouteAction> => {
        const { id } = ctx.params.id;
        const career = await this.careerService.findOneCareer(ctx, id);
        if (!career) return;
        ResponseService.res(ctx, ResponseCode.OK, career);
        return;
    };

    saveCareer = async (ctx: Context): Promise<RouteAction> => {
        const careerDto: ICareerDto = ctx.request.body;
        const newCareer = await this.careerService.saveCareer(careerDto);
        ResponseService.res(ctx, ResponseCode.CREATED, newCareer);
        return;
    };

    updateCareer = async (ctx: Context): Promise<RouteAction> => {
        const id: number = parseInt(ctx.params.id);
        const careerDto: ICareerDto = ctx.request.body;
        const careerEntity: CareerEntity = await this.careerService.updateCareer(ctx, careerDto, id);
        ResponseService.res(ctx, ResponseCode.ACCEPTED, careerEntity);
        return;
    };

    deleteCareer = async (ctx: Context): Promise<RouteAction> => {
        const id = parseInt(ctx.params.id);
        const career = await this.careerService.deleteCareer(ctx, id);
        ResponseService.res(ctx, ResponseCode.ACCEPTED, career);
        return;
    };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getCareerController = (app: App) => new CareerController(new CareerService());
