import { Context } from 'koa';
import { App } from '../bootstrap';
import { ResponseCode } from '../enums/response.enums';
import { ImageSliderService } from '../services/ImageSlider.service';
import { ResponseService } from '../services/Response.service';
import { ImageSliderRepository } from '../repository/ImageSlider.repository';
import { RouteAction } from '../types/route.types';
import { IImageSlider, IImageSliderDto } from '../interface/image-slider.interface';
import { ImageSliderEntity } from '../entity/ImageSlider.entity';

class ImageSliderController {
    imageSliderService: ImageSliderService;

    constructor(imageSliderService: ImageSliderService) {
        this.imageSliderService = imageSliderService;
    }

    getImageSlider = async (ctx: Context): Promise<RouteAction> => {
        const imageSliders: IImageSlider[] = await this.imageSliderService.getImageSliders();
        ResponseService.res(ctx, ResponseCode.OK, imageSliders);
        return;
    };

    saveImageSlider = async (ctx: Context): Promise<RouteAction> => {
        const imageSliderDto: IImageSliderDto = ctx.request.body;
        const images: ImageSliderEntity[] = await this.imageSliderService.saveImageSlider(imageSliderDto);
        ResponseService.res(ctx, ResponseCode.CREATED, images);
        return;
    };

    addImageTranslation = async (ctx: Context): Promise<RouteAction> => {
        const id: number = parseInt(ctx.params.id);
        const imageSliderDto: IImageSliderDto = ctx.request.body;
        const image: ImageSliderEntity = await this.imageSliderService.addImageSliderTranslation(ctx, imageSliderDto, id);
        ResponseService.res(ctx, ResponseCode.CREATED, image);
        return;
    };
}

export const getImageSliderController = (app?: App) => new ImageSliderController(new ImageSliderService(new ImageSliderRepository(app.dataSource)));
