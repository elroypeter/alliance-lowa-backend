import { hashPassword } from '../utils/hash.utils';
import { IPublicUser, IUser } from '../interface/user.interface';
import { UserRepository } from '../repository/User.repository';

export class UserService {
    userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
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

    static publiclyAccessibleUser(user: IUser): Pick<IUser, IPublicUser> {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
        };
    }
}
