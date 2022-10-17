import { App } from '../bootstrap';
import { Route } from '../types/route.types';
import { getAuthController } from '../controller/Auth.controller';

export const auth = (app: App): Route[] => [
  {
    name: 'login',
    path: '/login',
    httpMethod: 'post',
    action: getAuthController(app).login,
    guards: [],
  },
];
