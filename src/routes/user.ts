import { getUserController } from '../controller/User.controller';
import { App } from '../bootstrap';
import { authGuard } from '../middleware/auth.middleware';
import { Route } from '../types/route.types';

export const user = (app: App): Route[] => [
    {
        name: 'getUsers',
        path: '/api/user',
        httpMethod: 'get',
        action: getUserController(app).getUsers,
        guards: [authGuard],
    },
    {
        name: 'saveUser',
        path: '/api/user',
        httpMethod: 'post',
        action: getUserController(app).saveUser,
        guards: [],
    },
    {
        name: 'deleteUser',
        path: '/api/user/:id',
        httpMethod: 'delete',
        action: getUserController(app).deleteUser,
        guards: [authGuard],
    },
];
