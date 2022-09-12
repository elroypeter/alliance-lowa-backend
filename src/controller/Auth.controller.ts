import { Context, Next } from "koa";
import { User } from "../entity/User";
import * as Bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config";

class AuthController {
    constructor() {}

    async login(ctx: Context, next: Next) {
        try {
            const { email, password } = ctx.request.body;

            if (!(email && password)) {
                ctx.status = 400;
                ctx.message = "all input is required";
            }

            const user: User = await User.findOneBy({ email });

            if (user && (await Bcrypt.compare(password, user.password))) {
                // create token
                const token = sign(
                    {
                        userId: user.id,
                        email,
                        date: new Date().getTime(),
                    },
                    config.jwt_secret,
                    { expiresIn: config.token_ttl }
                );
                ctx.state = 200;
                ctx.body = {
                    token,
                    email,
                    id: user.id,
                    name: user.name,
                };
            }
            ctx.status = 400;
            ctx.message = "Invalid Credentails";
        } catch (error) {
            ctx.status = 400;
            ctx.message = "failed to process request";
        }
    }

    async changePassword(ctx: Context, next: Next) {}
}

export const AuthControllerObj = new AuthController();
