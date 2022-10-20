import { authGuard } from '../middleware/auth.middleware';
import { Route } from '../types/route.types';
import { App } from '../bootstrap';
import { getCareerController } from '../controller/Career.controller';

export const career = (app: App): Route[] => [
    {
        name: 'getCareer',
        path: '/api/careers',
        httpMethod: 'get',
        action: getCareerController(app).getCareer,
        guards: [authGuard],
    },
    {
        name: 'getSingleCareer',
        path: '/api/careers/:id',
        httpMethod: 'get',
        action: getCareerController(app).getSingleCareer,
        guards: [authGuard],
    },
    {
        name: 'getPublicCareer',
        path: '/api/public/careers',
        httpMethod: 'get',
        action: getCareerController(app).getCareer,
        guards: [],
    },
    {
        name: 'getSinglePublicCareer',
        path: '/api/public/careers/:id',
        httpMethod: 'get',
        action: getCareerController(app).getSingleCareer,
        guards: [],
    },
    {
        name: 'saveCareer',
        path: '/api/careers',
        httpMethod: 'post',
        action: getCareerController(app).saveCareer,
        guards: [authGuard],
    },
    {
        name: 'updateCareer',
        path: '/api/careers/:id',
        httpMethod: 'put',
        action: getCareerController(app).updateCareer,
        guards: [authGuard],
    },
    {
        name: 'deleteCareer',
        path: '/api/careers/:id',
        httpMethod: 'delete',
        action: getCareerController(app).deleteCareer,
        guards: [authGuard],
    },
];
