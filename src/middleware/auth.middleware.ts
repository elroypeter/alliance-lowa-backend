import { Context, Next } from 'koa';
import { config } from '../config';
import { JwtPayload, verify } from 'jsonwebtoken';

export const authGuard = (ctx: Context, next: Next) => {
  const token = ctx.request.headers.token;

  if (!token) {
    ctx.status = 400;
    ctx.message = 'missing token';
    ctx.body = { message: 'token is required for authentication' };
    return;
  } else {
    try {
      const payload: string | JwtPayload = verify(
        String(token),
        config.jwt_secret,
      );

      // check if token has expired
      const dateNow = new Date();

      if (payload['exp'] * 1000 > dateNow.getTime()) {
        return next();
      } else {
        ctx.status = 400;
        ctx.message = 'token has expired';
        ctx.body = { message: 'expired' };
        return;
      }
    } catch (error) {
      ctx.status = 401;
      ctx.message = 'Unauthorized';
      ctx.body = { message: 'Invalid Token' };
      return;
    }
  }
};
