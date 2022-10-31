import { hashPassword } from '../utils/hash.utils';
import { IPublicUser, IUser, IUserDto } from '../interface/user.interface';
import { UserRepository } from '../repository/User.repository';
import { UserEntity } from '../entity/User.entity';
import { Context } from 'koa';
import { ResponseService } from './Response.service';
import { ResponseCode } from '../enums/response.enums';

export class UserService {
    userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async findAllUsers(): Promise<IUser[]> {
        return await this.userRepository.find();
    }

    async findUserByEmail(email: string): Promise<IUser> {
        return await this.userRepository.findUserByEmail(email);
    }

    async findUserByEmailAndCode(email: string, code: string): Promise<IUser> {
        return await this.userRepository.findOne({ where: { email: email, passwordResetCode: code } });
    }

    async updatePasswordUserByEmail(id: number, password: string): Promise<any> {
        return await this.userRepository.update({ id }, { password: await hashPassword(password), passwordResetCode: null });
    }

    async assignUserResetCode(id: number, passwordResetCode: string): Promise<any> {
        return await this.userRepository.update({ id }, { passwordResetCode });
    }

    async saveUser(ctx, userDto: IUserDto): Promise<IUser[] | null> {
        const userEntity: UserEntity = new UserEntity();
        userEntity.email = userDto.email;
        userEntity.name = userDto.name;
        userEntity.password = await hashPassword(userDto.password);
        try {
            await userEntity.save();
        } catch (error) {
            ResponseService.throwReponseException(ctx, error, ResponseCode.BAD_REQUEST);
            return null;
        }
        return await UserEntity.find();
    }

    async deleteUser(ctx: Context, id: number): Promise<IUser> {
        const user = await UserEntity.findOne({ where: { id } });
        if (!user) {
            ResponseService.throwReponseException(ctx, 'User with id not found', ResponseCode.BAD_REQUEST);
            return user;
        }
        await UserEntity.delete(user.id);
        return user;
    }

    static publiclyAccessibleUser(user: IUser): Pick<IUser, IPublicUser> {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
        };
    }
}
