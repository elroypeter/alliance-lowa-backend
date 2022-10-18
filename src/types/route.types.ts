import { Context, Next } from 'koa';

export type Route = {
    name: string;
    path: string;
    action: RouteAction;
    guards?: RouteGuard[];
    httpMethod: string;
};

export enum HttpVerb {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    PATCH = 'patch',
    DELETE = 'delete',
}

export type RouteAction = (context: Context, next?: Next) => Promise<any>;

export type RouteGuard = (context: Context, next?: Next) => Promise<any>;
