import { IUser } from '../interface/user.interface';
import { UserRepository } from '../repository/User.repository';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findUserByEmail(email: string): Promise<IUser> {
    return this.userRepository.findUserByEmail(email);
  }
}
