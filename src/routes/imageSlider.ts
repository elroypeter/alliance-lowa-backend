import { getImageSliderController } from '../controller/ImageSlider.controller';
import { authGuard } from '../middleware/auth.middleware';
import { App } from '../bootstrap';
import { Route } from '../types/route.types';

export const imageSlider = (app: App): Route[] => [
    {
        name: 'getImageSlider',
        path: '/api/image-slider',
        httpMethod: 'get',
        action: getImageSliderController(app).getImageSlider,
        guards: [authGuard],
    },
    {
        name: 'getPublicImageSlider',
        path: '/api/image-slider/public',
        httpMethod: 'get',
        action: getImageSliderController(app).getImageSlider,
        guards: [],
    },
    {
        name: 'saveImageSlider',
        path: '/api/image-slider',
        httpMethod: 'post',
        action: getImageSliderController(app).saveImageSlider,
        guards: [authGuard],
    },
    {
        name: 'addImageTranslation',
        path: '/api/image-slider/translation/:id',
        httpMethod: 'post',
        action: getImageSliderController(app).addImageTranslation,
        guards: [authGuard],
    },
    {
        name: 'addImageTranslation',
        path: '/api/image-slider/translation/:id',
        httpMethod: 'put',
        action: getImageSliderController(app).updateImageTranslation,
        guards: [authGuard],
    },
    {
        name: 'deleteImageSlider',
        path: '/api/image-slider/:id',
        httpMethod: 'delete',
        action: getImageSliderController(app).deleteImageSlider,
        guards: [authGuard],
    },
    {
        name: 'publishImageSlider',
        path: '/api/image-slider/publish/:id',
        httpMethod: 'put',
        action: getImageSliderController(app).changePublishStatus,
        guards: [authGuard],
    },
];
