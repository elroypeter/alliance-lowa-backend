import { Context } from 'koa';

export class ResponseService {
    static res(ctx: Context, status: number, body: any): any {
        ctx.status = status;
        ctx.body = body;
    }

    static throwReponseException(ctx: Context, ...args: any): void {
        ctx.throw(...args);
    }
}
