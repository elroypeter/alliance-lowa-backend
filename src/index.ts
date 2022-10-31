import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { App } from './bootstrap';

import { configService } from './config';
import { RegisteredEntities } from './entity';

new DataSource(configService(RegisteredEntities).app_data_source).initialize().then((dataSource: DataSource) => {
    new App(configService(RegisteredEntities), dataSource).initApp();
});
