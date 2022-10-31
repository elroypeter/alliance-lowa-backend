import { Context } from 'koa';
import { comparePassword, getTokenPayLoad, hasTokenExpired, signToken } from '../utils/hash.utils';
import { configService } from '../config';
import { ResponseCode } from '../enums/response.enums';
import { IUser } from '../interface/user.interface';
import { NotificationService } from './Notification.service';
import { ResponseService } from './Response.service';
import { UserService } from './User.service';

export class AuthService {
    userService: UserService;
    notificationService: NotificationService;

    constructor(userService: UserService, notificationService: NotificationService) {
        this.userService = userService;
        this.notificationService = notificationService;
    }

    async createToken(email: string, password: string, ctx: Context): Promise<any> {
        const user: IUser = await this.userService.findUserByEmail(email);

        if (!user) {
            ResponseService.throwReponseException(ctx, 'User with email not found', ResponseCode.UNAUTHORIZED);
        }

        const passwordMatch = await comparePassword(password, user.password);

        if (!passwordMatch) {
            ResponseService.throwReponseException(ctx, 'Invalid user password', ResponseCode.UNAUTHORIZED);
        }

        return {
            user: UserService.publiclyAccessibleUser(user),
            token: signToken(
                {
                    userId: user.id,
                    email: email,
                    date: new Date().getTime(),
                },
                configService().token_ttl,
            ),
        };
    }

    async sendResetLink(ctx: Context, email: string): Promise<IUser> {
        const user: IUser = await this.userService.findUserByEmail(email);
        if (!user) {
            ResponseService.throwReponseException(ctx, 'User with email not found', ResponseCode.BAD_REQUEST);
            return user;
        }

        await this.userService.assignUserResetCode(user.id, signToken({ id: user.id }, '1h'));

        await this.notificationService.sendEmail(user.email, {}, {});
        return user;
    }

    async verifyResetCode(ctx: Context, data: any): Promise<boolean> {
        const user: IUser = await this.userService.findUserByEmail(data.email);
        if (!user) {
            ResponseService.throwReponseException(ctx, 'User with email not found', ResponseCode.BAD_REQUEST);
            return !!user;
        }

        if (!hasTokenExpired(getTokenPayLoad(data.code, true)['exp']) && user.passwordResetCode === data.code) {
            return true;
        } else {
            ResponseService.throwReponseException(ctx, 'Reset code is invalid or expired', ResponseCode.BAD_REQUEST);
            return false;
        }
    }

    async updatePassword(ctx: Context, data: any): Promise<boolean> {
        const user: IUser = await this.userService.findUserByEmailAndCode(data.email, data.code);
        if (!user) {
            ResponseService.throwReponseException(ctx, 'User with email or reset code is not found', ResponseCode.BAD_REQUEST);
            return !!user;
        }
        await this.userService.updatePasswordUserByEmail(user.id, data.newPassword);
        return true;
    }
}
