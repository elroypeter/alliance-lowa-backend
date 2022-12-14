import * as compose from 'koa-compose';
import { subscriber } from './subscriber';
import { auth } from './auth';
import { user } from './user';
import { imageSlider } from './imageSlider';
import { project } from './project';
import { message } from './message';
import { App } from '../bootstrap';
import { Route } from '../types/route.types';
import { career } from './career';
import { blog } from './blog';

const routes = (app: App) => [
    ...subscriber(app),
    ...auth(app),
    ...user(app),
    ...imageSlider(app),
    ...project(app),
    ...message(app),
    ...career(app),
    ...blog(app),
];

export const Routes = (router, app: App) => {
    const config = (route: Route) => {
        router[route.httpMethod](route.path, compose([...route.guards, route.action]));
    };

    routes(app).forEach((route) => {
        config(route);
    });
};
