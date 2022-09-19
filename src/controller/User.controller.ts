import { Context, Next } from "koa";
import { User } from "../entity/User";
import * as Bcrypt from "bcrypt";

class UserController {
    constructor() {}

    async getUsers(ctx: Context, next: Next) {
        const users: User[] = await User.find();
        ctx.status = 200;
        ctx.body = users;
    }

    async saveUser(ctx: Context, next: Next) {
        const { name, email, password } = ctx.request.body;

        // validate user details
        if (!(email && password && name)) {
            ctx.status = 400;
            ctx.message = "email or password or name is missing";
            return;
        }

        // check if user exists
        const oldUser: User = await User.findOne({ where: { email } });
        if (oldUser) {
            ctx.state = 400;
            ctx.message = "user with email already exists";
            return;
        }

        const user: User = new User();
        user.email = email;
        user.name = name;
        user.password = await Bcrypt.hash(password, 10);

        await user.save();
        ctx.body = { message: "saved successfully" };
        ctx.status = 200;
    }

    async deleteUser(ctx: Context, next: Next) {}
}

export const UserControllerObj = new UserController();
