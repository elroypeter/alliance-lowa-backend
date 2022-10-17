import { Context } from 'koa';
import { App } from '../bootstrap';
import { RouteAction } from '../types/route.types';
import { ResponseCode } from '../enums/response.enums';
import { UserRepository } from '../repository/User.repository';
import { AuthService } from '../services/Auth.service';
import { ResponseService } from '../services/Response.service';
import { UserService } from '../services/User.service';

class AuthController {
  authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  login = async (ctx: Context): Promise<RouteAction> => {
    const { email, password }: any = ctx.request.body;

    if (!(email && password)) {
      ResponseService.throwReponseException(
        ctx,
        'Invalid credentials',
        ResponseCode.UNAUTHORIZED,
      );
      return;
    }

    const token = await this.authService.createToken(email, password, ctx);
    ResponseService.res(ctx, 200, { token });
    return;
  };
}

export const getAuthController = (app?: App) =>
  new AuthController(
    new AuthService(new UserService(new UserRepository(app.dataSource))),
  );
