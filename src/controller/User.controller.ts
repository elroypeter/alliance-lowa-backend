import { Context } from 'koa';
import { ResponseCode } from '../enums/response.enums';
import { IUser, IUserDto } from '../interface/user.interface';
import { UserRepository } from '../repository/User.repository';
import { ResponseService } from '../services/Response.service';
import { UserService } from '../services/User.service';
import { RouteAction } from '../types/route.types';
import { App } from '../bootstrap';

class UserController {
    userService: UserService;
    constructor(userService: UserService) {
        this.userService = userService;
    }

    getUsers = async (ctx: Context): Promise<RouteAction> => {
        const users = await this.userService.findAllUsers();
        ResponseService.res(ctx, ResponseCode.OK, users);
        return;
    };

    saveUser = async (ctx: Context): Promise<RouteAction> => {
        const user: IUserDto = ctx.request.body;
        const result = await this.userService.saveUser(ctx, user);
        if (!result) return;
        ResponseService.res(ctx, ResponseCode.CREATED, result);
        return;
    };

    deleteUser = async (ctx: Context): Promise<RouteAction> => {
        const id = parseInt(ctx.params.id);
        const user: IUser = await this.userService.deleteUser(ctx, id);
        ResponseService.res(ctx, ResponseCode.ACCEPTED, user);
        return;
    };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getUserController = (app: App) => new UserController(new UserService(new UserRepository(app.dataSource)));
