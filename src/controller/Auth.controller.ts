import { Context } from 'koa';
import { DataSource } from 'typeorm';
import { ResponseCode } from '../enums/response.enums';
import { UserRepository } from '../repository/User.repository';
import { AuthService } from '../services/Auth.service';
import { ResponseService } from '../services/Response.service';
import { UserService } from '../services/User.service';

class AuthController {
  constructor(private authService: AuthService) {}

  async login(ctx: Context) {
    const { email, password }: any = ctx.body;

    if (!(email && password)) {
      ResponseService.throwReponseException(
        ctx,
        'Invalid credentials',
        ResponseCode.UNAUTHORIZED,
      );
      return;
    }

    const token = await this.authService.createToken(email, password, ctx);

    return ResponseService.res(ctx, 200, { token });
  }
}

export const AuthControllerObj = (dataSource?: DataSource) =>
  new AuthController(
    new AuthService(new UserService(new UserRepository(dataSource))),
  );
