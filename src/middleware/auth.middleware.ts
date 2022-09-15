import { Context, Next } from "koa";
import { config } from "../config";
import { JwtPayload, verify } from "jsonwebtoken";

export const verifyToken = (ctx: Context, next: Next) => {
    const token = ctx.request.headers["token"];
    if (!token) {
        ctx.status = 400;
        ctx.message = "missing token";
        ctx.body = { message: "token is required for authentication" };
        return;
    } else {
        try {
            const decoded: string | JwtPayload = verify(
                String(token),
                config.jwt_secret,
                { clockTimestamp: new Date().getTime() }
            );

            // check if token has expired
            const dateNow = new Date();

            if (decoded["exp"] * 1000 > dateNow.getTime()) {
                ctx.status = 400;
                ctx.message = "token has expired";
                ctx.body = { message: "expired" };
                return;
            } else {
                return next();
            }
        } catch (error) {
            ctx.status = 401;
            ctx.message = "Unauthorized";
            ctx.body = { message: "Invalid Token" };
            return;
        }
    }
};
