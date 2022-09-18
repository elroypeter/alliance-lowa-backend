import "reflect-metadata";
import { AppDataSource } from "./data-source";

import * as Koa from "koa";
import * as Logger from "koa-logger";
import * as Router from "@koa/router";
import * as KoaBody from "koa-body";
import * as KoaCors from "@koa/cors";
import * as KoaCompress from "koa-compress";
import * as KoaRateLimit from "koa-better-ratelimit";

import { config } from "./config";
import { Routes } from "./routes/routes";
import { DataSource } from "typeorm";

AppDataSource.initialize()
    .then((dataSource: DataSource) => {
        // instantiate Koa
        const app = new Koa();
        const router = new Router();

        // bind middleware to Koa instance
        app.use(Logger());
        app.use(KoaBody());
        app.use(KoaCors());

        // compress traffic
        const compressOpts = {
            filter: (content_type) => /text/i.test(content_type),
            threshold: 2048,
            flush: require("zlib").Z_SYNC_FLUSH,
        };
        app.use(KoaCompress(compressOpts));

        // rate limiting
        app.use(
            KoaRateLimit({ duration: 1000 * 60 * 3, max: 1000, blacklist: [] })
        );

        // configure routes
        Routes(router);
        app.use(router.routes());

        // spawn server
        app.listen(config.app_port, () =>
            console.log(`server is running at port ${config.app_port}`)
        );
    })
    .catch(console.error);
