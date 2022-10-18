import { Context } from 'koa';
import { App } from '../bootstrap';
import { RouteAction } from '../types/route.types';
import { ResponseCode } from '../enums/response.enums';
import { UserRepository } from '../repository/User.repository';
import { AuthService } from '../services/Auth.service';
import { ResponseService } from '../services/Response.service';
import { UserService } from '../services/User.service';
import { NotificationService } from '../services/Notification.service';

class AuthController {
    authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    login = async (ctx: Context): Promise<RouteAction> => {
        const { email, password }: any = ctx.request.body;
        const token = await this.authService.createToken(email, password, ctx);
        ResponseService.res(ctx, ResponseCode.OK, { token });
        return;
    };

    resetPassword = async (ctx: Context): Promise<RouteAction> => {
        const { email }: any = ctx.request.body;
        if (!(await this.authService.sendResetLink(ctx, email))) return;
        ResponseService.res(ctx, ResponseCode.OK, 'Reset link has been sent');
        return;
    };

    verifyResetPasswordCode = async (ctx: Context): Promise<RouteAction> => {
        const { code, email }: any = ctx.request.body;
        const verify = await this.authService.verifyResetCode(ctx, { code, email });
        if (!verify) return;
        ResponseService.res(ctx, ResponseCode.OK, 'Reset code is valid');
        return;
    };

    changePassword = async (ctx: Context): Promise<RouteAction> => {
        const { email, code, newPassword }: any = ctx.request.body;
        const changed = await this.authService.updatePassword(ctx, { email, code, newPassword });
        if (!changed) return;
        ResponseService.res(ctx, ResponseCode.OK, 'Password has been updated');
        return;
    };
}

export const getAuthController = (app?: App) => new AuthController(new AuthService(new UserService(new UserRepository(app.dataSource)), new NotificationService()));
