import { Context } from 'koa';
import { App } from '../bootstrap';
import { ResponseCode } from '../enums/response.enums';
import { ImageSliderService } from '../services/ImageSlider.service';
import { ResponseService } from '../services/Response.service';
import { ImageSliderRepository } from '../repository/ImageSlider.repository';
import { RouteAction } from '../types/route.types';
import { IImageSlider, IImageSliderDto } from '../interface/image-slider.interface';
import { ImageSliderEntity } from '../entity/ImageSlider.entity';
import { ImageSliderTranslationEntity } from '../entity/ImageSliderTranslation.entity';

class ImageSliderController {
    imageSliderService: ImageSliderService;

    constructor(imageSliderService: ImageSliderService) {
        this.imageSliderService = imageSliderService;
    }

    getImageSlider = async (ctx: Context): Promise<RouteAction> => {
        const { langCode, isPublished } = ctx.request.query as { [x: string]: string & undefined };
        const imageSliders: IImageSlider[] = await this.imageSliderService.getImageSliders(langCode, isPublished === 'true' ? true : false);
        ResponseService.res(ctx, ResponseCode.OK, imageSliders);
        return;
    };

    getAllImageSliders = async (ctx: Context): Promise<RouteAction> => {
        const imageSliders: ImageSliderEntity[] = await this.imageSliderService.getAllImageSliders();
        ResponseService.res(ctx, ResponseCode.OK, imageSliders);
        return;
    };

    getSingleImageSlider = async (ctx: Context): Promise<RouteAction> => {
        const id: number = parseInt(ctx.params.id);
        const imageSlider: ImageSliderEntity = await this.imageSliderService.getSingleImageSlider(ctx, id);
        ResponseService.res(ctx, ResponseCode.OK, imageSlider);
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

    updateImageTranslation = async (ctx: Context): Promise<RouteAction> => {
        const id: number = parseInt(ctx.params.id);
        const imageSliderDto: IImageSliderDto = ctx.request.body;
        const imageTranslation: ImageSliderTranslationEntity = await this.imageSliderService.updateImageSliderTranslation(ctx, imageSliderDto, id);
        ResponseService.res(ctx, ResponseCode.CREATED, imageTranslation);
        return;
    };

    changePublishStatus = async (ctx: Context): Promise<RouteAction> => {
        const { status } = ctx.request.body;
        const id: number = parseInt(ctx.params.id);
        const image: ImageSliderEntity = await this.imageSliderService.changePublishStatus(ctx, status, id);
        ResponseService.res(ctx, ResponseCode.ACCEPTED, image);
        return;
    };

    deleteImageSlider = async (ctx: Context): Promise<RouteAction> => {
        const id: number = parseInt(ctx.params.id);
        const image: ImageSliderEntity = await this.imageSliderService.deleteImageSlider(ctx, id);
        ResponseService.res(ctx, ResponseCode.ACCEPTED, image);
        return;
    };

    deleteTranslation = async (ctx: Context): Promise<RouteAction> => {
        const id: number = parseInt(ctx.params.id);
        const image: ImageSliderTranslationEntity = await this.imageSliderService.deleteTranslation(ctx, id);
        ResponseService.res(ctx, ResponseCode.ACCEPTED, image);
        return;
    };
}

export const getImageSliderController = (app?: App) => new ImageSliderController(new ImageSliderService(new ImageSliderRepository(app.dataSource)));
