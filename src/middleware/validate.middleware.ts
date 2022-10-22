import { Context, Next } from 'koa';
import * as Joi from 'joi';
import { ResponseService } from '../services/Response.service';
import { ResponseCode } from '../enums/response.enums';

export const validator = (schema: Joi.ObjectSchema, reqParam: ['body' | 'query']) => {
    return async (ctx: Context, next: Next) => {
        for (const param of reqParam) {
            const { error } = schema.validate(ctx.request[param]);
            if (error) {
                ResponseService.throwReponseException(ctx, error, ResponseCode.BAD_REQUEST);
                return;
            }
        }
        await next();
    };
};
