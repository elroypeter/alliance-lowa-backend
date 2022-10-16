import * as compose from 'koa-compose';
import { subscriber } from './subscriber';
import { auth } from './auth';
import { user } from './user';
import { imageSlider } from './imageSlider';
import { project } from './project';
import { message } from './message';
import { DataSource } from 'typeorm';

const routes = (dataSource: DataSource) => [
  ...subscriber,
  ...auth(dataSource),
  ...user,
  ...imageSlider,
  ...project,
  ...message,
];

export const Routes = (router, dataSource: DataSource) => {
  const config = (route) => {
    router[route['@httpMethod']](
      route['@path'],
      compose([...route['@guards'], route['@action']]),
    );
  };

  routes(dataSource).forEach((route) => {
    config(route);
  });
};
