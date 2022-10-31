import { Context, Next } from 'koa';
import { JwtPayload } from 'jsonwebtoken';
import { RouteGuard } from '../types/route.types';
import { ResponseCode } from '../enums/response.enums';
import { getTokenPayLoad, hasTokenExpired } from '../utils/hash.utils';
import { IPublicUser, IUser } from '../interface/user.interface';
import { UserEntity } from '../entity/User.entity';
import { UserService } from '../services/User.service';

export const authGuard: RouteGuard = async (ctx: Context, next: Next) => {
    const token = ctx.request.headers.token;

    if (!token) {
        ctx.body = 'token is required for authentication';
        ctx.status = ResponseCode.BAD_REQUEST;
    } else {
        try {
            const payload: string | JwtPayload = getTokenPayLoad(String(token));
            const user: Pick<IUser, IPublicUser> = UserService.publiclyAccessibleUser(await UserEntity.findOneBy({ id: payload['userId'] }));

            if (!hasTokenExpired(payload['exp'])) {
                ctx.set('user', JSON.stringify(user));
                await next();
            } else {
                ctx.body = { message: 'token has expired' };
                ctx.status = ResponseCode.BAD_REQUEST;
            }
        } catch (error) {
            ctx.body = { message: 'Unknown error' };
            ctx.status = ResponseCode.INTERNAL_SERVER_ERROR;
            throw error;
        }
    }
};

// 5225 1100 0532 3352
// 10/23 607
