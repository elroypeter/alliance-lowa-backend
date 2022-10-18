import { Context, Next } from 'koa';
import { JwtPayload } from 'jsonwebtoken';
import { RouteGuard } from 'src/types/route.types';
import { ResponseCode } from 'src/enums/response.enums';
import { getTokenPayLoad, hasTokenExpired } from 'src/utils/hash.utils';

export const authGuard: RouteGuard = async (ctx: Context, next: Next) => {
    const token = ctx.request.headers.token;

    if (!token) {
        ctx.body = { message: 'token is required for authentication' };
        ctx.status = ResponseCode.BAD_REQUEST;
    } else {
        try {
            const payload: string | JwtPayload = getTokenPayLoad(String(token));

            if (!hasTokenExpired(payload['exp'])) {
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
