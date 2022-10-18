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
        name: 'saveImageSlider',
        path: '/api/image-slider',
        httpMethod: 'post',
        action: getImageSliderController(app).saveImageSlider,
        guards: [authGuard],
    },
    {
        name: 'addImageTranslation',
        path: '/api/image-slider/:id',
        httpMethod: 'put',
        action: getImageSliderController(app).addImageTranslation,
        guards: [authGuard],
    },
];
