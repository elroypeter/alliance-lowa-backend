import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../entity/User.entity';
import { IUser } from '../interface/user.interface';

export class UserRepository extends Repository<UserEntity> {
  constructor(dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async findUserByEmail(email: string): Promise<IUser> {
    return await this.findOneBy({ email });
  }
}
