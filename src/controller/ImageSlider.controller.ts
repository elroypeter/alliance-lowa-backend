import { Context } from 'koa';
import { App } from '../bootstrap';
import { ResponseCode } from '../enums/response.enums';
import { ImageSliderService } from '../services/ImageSlider.service';
import { ResponseService } from '../services/Response.service';
import { ImageSliderRepository } from '../repository/ImageSlider.repository';
import { RouteAction } from '../types/route.types';
import { IImageSlider } from '../interface/image-slider.interface';

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
}

export const getImageSliderController = (app?: App) => new ImageSliderController(new ImageSliderService(new ImageSliderRepository(app.dataSource)));
