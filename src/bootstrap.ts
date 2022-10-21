import * as Path from 'path';
import * as Koa from 'koa';
import * as Logger from 'koa-logger';
import * as Router from '@koa/router';
import * as KoaBody from 'koa-body';
import * as KoaCors from '@koa/cors';
import * as KoaMount from 'koa-mount';
import * as KoaStatic from 'koa-static';
import * as KoaCompress from 'koa-compress';
import * as KoaRateLimit from 'koa-better-ratelimit';
import * as zlib from 'zlib';

import { DataSource } from 'typeorm';
import { Routes } from './routes/routes';
import { AppConfig } from './types/appconfig.types';
import { Server } from 'http';

export class App {
    koaInstance: Koa;
    koaServer: Server;
    dataSource: DataSource;
    config: any;

    constructor(dataConfig: any, dataSource: DataSource) {
        this.config = dataConfig;
        this.dataSource = dataSource;
    }

    async initApp(appConfig?: AppConfig): Promise<App> {
        // sync data in test|dev mode
        if (this.config.app_env !== 'prod') await this.dataSource.synchronize(true);

        // instantiate Koa
        this.koaInstance = new Koa();
        const router = new Router();

        // bind middleware to Koa instance
        if (appConfig?.enableKoaLogger) this.koaInstance.use(Logger());
        this.koaInstance.use(KoaBody({ jsonLimit: '20mb' }));
        this.koaInstance.use(KoaCors());

        // mount image server middleware
        this.koaInstance.use(KoaMount('/images', KoaStatic(Path.join(__dirname, '../public'))));

        // compress traffic
        const compressOpts = {
            filter: (content_type) => /text/i.test(content_type),
            threshold: 2048,
            flush: zlib.constants.Z_SYNC_FLUSH,
        };
        this.koaInstance.use(KoaCompress(compressOpts));

        // rate limiting
        this.koaInstance.use(KoaRateLimit({ duration: 1000 * 60 * 3, max: 1000, blacklist: [] }));

        // configure routes
        Routes(router, this);
        this.koaInstance.use(router.routes());

        this.koaServer = this.koaInstance.listen(this.config.app_port, () => {
            if (this.config.app_env !== 'test') console.info(`server is running at port ${this.config.app_port}`);
        });

        return this;
    }
}
