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
];
