import { UserEntity } from '../../entity/User.entity';
import { hashPassword } from '../../utils/hash.utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seed1736153643806 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const users = [
            // {
            //     email: 'admin@allowa.org',
            //     name: 'Admin Allowa',
            //     password: 'test',
            // },
            {
                email: 'g.zihalirwa@allowa.org',
                name: 'G Zihalirwa',
                password: 'Gzil@2025',
            },
            {
                email: 'abraham.mumbere@allowa.org',
                name: 'Abraham Mumbere',
                password: 'Abrah@2025',
            },
        ];

        const userRepository = queryRunner.connection.getRepository<UserEntity>(UserEntity);

        for (const u of users) {
            await userRepository.save({
                email: u.email,
                name: u.name,
                password: await hashPassword(u.password),
            });
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // do nothing
    }
}
