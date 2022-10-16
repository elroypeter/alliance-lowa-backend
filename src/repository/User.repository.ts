import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../entity/User.entity';
import { IUser } from '../interface/user.interface';

export class UserRepository extends Repository<UserEntity> {
  constructor(private dataSoucre: DataSource) {
    super(UserEntity, dataSoucre.createEntityManager());
  }

  async findUserByEmail(email: string): Promise<IUser> {
    return await this.findBy({ email })[0];
  }
}
