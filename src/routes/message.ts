import { Route } from '../types/route.types';
import { App } from '../bootstrap';
import { authGuard } from '../middleware/auth.middleware';
import { getMessageController } from '../controller/MessageController';

export const message = (app: App): Route[] => [
    {
        name: 'getMessages',
        path: '/api/contact-message',
        httpMethod: 'get',
        action: getMessageController(app).getMessage,
        guards: [authGuard],
    },
    {
        name: 'saveMessage',
        path: '/api/contact-message',
        httpMethod: 'post',
        action: getMessageController(app).saveMessage,
        guards: [],
    },
    {
        name: 'getSingleMessages',
        path: '/api/contact-message/:id',
        httpMethod: 'get',
        action: getMessageController(app).getSingleMessage,
        guards: [authGuard],
    },
    {
        name: 'deleteMessages',
        path: '/api/contact-message/:id',
        httpMethod: 'delete',
        action: getMessageController(app).deleteMessage,
        guards: [authGuard],
    },
];
