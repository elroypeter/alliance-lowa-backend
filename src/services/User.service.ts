import { IUser } from '../interface/user.interface';
import { UserRepository } from '../repository/User.repository';

export class UserService {
  userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async findUserByEmail(email: string): Promise<IUser> {
    return await this.userRepository.findUserByEmail(email);
  }
}
