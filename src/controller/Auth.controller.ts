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
                ctx.body = { message: "all input is required" };
                return;
            }

            const user: User = await User.findOneBy({ email });
            const isMatch = Bcrypt.compareSync(password, user.password);

            if (user && isMatch) {
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
                return;
            }

            ctx.status = 400;
            ctx.message = "Invalid Credentails";
            return;
        } catch (error) {
            ctx.status = 400;
            ctx.message = error;
            return;
        }
    }

    async changePassword(ctx: Context, next: Next) {}
}

export const AuthControllerObj = new AuthController();
