import { App } from '../bootstrap';
import { Route } from '../types/route.types';
import { getAuthController } from '../controller/Auth.controller';

export const auth = (app: App): Route[] => [
    {
        name: 'login',
        path: '/auth/login',
        httpMethod: 'post',
        action: getAuthController(app).login,
        guards: [],
    },
    {
        name: 'resetPassword',
        path: '/auth/reset-password',
        httpMethod: 'post',
        action: getAuthController(app).resetPassword,
        guards: [],
    },
    {
        name: 'verifyPasswordCode',
        path: '/auth/verify-password-code',
        httpMethod: 'post',
        action: getAuthController(app).verifyResetPasswordCode,
        guards: [],
    },
    {
        name: 'changePassword',
        path: '/auth/change-password',
        httpMethod: 'post',
        action: getAuthController(app).changePassword,
        guards: [],
    },
];
