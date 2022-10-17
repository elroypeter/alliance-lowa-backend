import { Context, Next } from 'koa';
import { JwtPayload, verify } from 'jsonwebtoken';
import { RouteGuard } from 'src/types/route.types';
import { configService } from 'src/config';
import { ResponseCode } from 'src/enums/response.enums';

export const authGuard: RouteGuard = async (ctx: Context, next: Next) => {
  const token = ctx.request.headers.token;

  if (!token) {
    ctx.body = { message: 'token is required for authentication' };
    ctx.status = ResponseCode.BAD_REQUEST;
  } else {
    try {
      const payload: string | JwtPayload = verify(
        String(token),
        configService().jwt_secret,
      );

      // check if token has expired
      const dateNow = new Date();

      if (payload['exp'] * 1000 > dateNow.getTime()) {
        await next();
      } else {
        ctx.body = { message: 'token has expired' };
        ctx.status = ResponseCode.BAD_REQUEST;
      }
    } catch (error) {
      ctx.body = { message: 'Invalid Token' };
      ctx.status = 401;
    }
  }
};
