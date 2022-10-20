import { authGuard } from '../middleware/auth.middleware';
import { Route } from '../types/route.types';
import { App } from '../bootstrap';
import { getSubscriberController } from '../controller/Subscriber.controller';

export const subscriber = (app: App): Route[] => [
    {
        name: 'getSubscriber',
        path: '/api/subscriber',
        httpMethod: 'get',
        action: getSubscriberController(app).getSubscriber,
        guards: [authGuard],
    },
    {
        name: 'saveSubscriber',
        path: '/api/subscriber',
        httpMethod: 'post',
        action: getSubscriberController(app).saveSubscriber,
        guards: [],
    },
    {
        name: 'deleteSubscriber',
        path: '/api/subscriber/:id',
        httpMethod: 'delete',
        action: getSubscriberController(app).deleteSubscriber,
        guards: [authGuard],
    },
];
