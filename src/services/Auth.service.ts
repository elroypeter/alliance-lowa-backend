import * as Bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Context } from 'koa';
import { config } from '../config';
import { ResponseCode } from '../enums/response.enums';
import { IUser } from '../interface/user.interface';
import { ResponseService } from './Response.service';
import { UserService } from './User.service';

export class AuthService {
  constructor(private userService: UserService) {}

  async comparePassword(
    passwordText: string,
    passwordHash: string,
  ): Promise<boolean> {
    return await Bcrypt.compare(passwordText, passwordHash);
  }

  async createToken(
    email: string,
    password: string,
    ctx: Context,
  ): Promise<string> {
    const user: IUser = await this.userService.findUserByEmail(email);

    if (!user) {
      ResponseService.throwReponseException(
        ctx,
        'User with email not found',
        ResponseCode.UNAUTHORIZED,
      );
    }

    const passwordMatch = await this.comparePassword(password, user.password);

    if (!passwordMatch) {
      ResponseService.throwReponseException(
        ctx,
        'Invalid user password',
        ResponseCode.UNAUTHORIZED,
      );
    }

    return sign(
      {
        userId: user.id,
        email: email,
        date: new Date().getTime(),
      },
      config.jwt_secret,
      { expiresIn: config.token_ttl },
    );
  }
}
