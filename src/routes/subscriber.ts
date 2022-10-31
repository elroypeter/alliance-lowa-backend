import { authGuard } from '../middleware/auth.middleware';
import { Route } from '../types/route.types';
import { App } from '../bootstrap';
import { getSubscriberController } from '../controller/Subscriber.controller';
import { validator } from '../middleware/validate.middleware';
import { SubscriberSchema } from '../interface/subscriber.interface';

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
        guards: [validator(SubscriberSchema, ['body'])],
    },
    {
        name: 'deleteSubscriber',
        path: '/api/subscriber/:id',
        httpMethod: 'delete',
        action: getSubscriberController(app).deleteSubscriber,
        guards: [authGuard],
    },
];
