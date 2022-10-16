import { Context } from 'koa';

export class ResponseService {
  static res(ctx: Context, status: number, body: any, message?: string): any {
    ctx.status = status;
    ctx.body = body;
    ctx.message = message;
  }

  static throwReponseException(ctx: Context, ...args: any): void {
    ctx.throw(...args);
  }
}
