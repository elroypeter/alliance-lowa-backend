import { Context, Next } from "koa";
import { config } from "../config";
import { JwtPayload, verify } from "jsonwebtoken";

export const verifyToken = (ctx: Context, next: Next) => {
    const token = ctx.request.headers["token"];
    if (!token) {
        ctx.status = 403;
        ctx.message = "missing token";
        ctx.body = { message: "session token is required for authentication" };
    } else {
        try {
            const decoded: string | JwtPayload = verify(
                String(token),
                config.jwt_secret
            );

            // check if token has expired
            const dateNow = new Date();
            const dateDif = dateNow.getTime() - decoded["date"];

            if (dateDif >= 2 * 60 * 60 * 100) {
                ctx.status = 400;
                ctx.message = "token has expired";
                ctx.body = { message: "expired" };
            } else {
                next();
            }
        } catch (error) {
            ctx.status = 401;
            ctx.message = "Unauthorized";
            ctx.body = { message: "Invalid Token" };
        }
    }
};
