import { configService } from './config';
import { RegisteredEntities } from './entity';

import { DataSource } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

const config = configService(RegisteredEntities);
const databaseOptions = config.app_data_source as MysqlConnectionOptions;

export default new DataSource({
    ...databaseOptions,
    synchronize: false,
    extra: {
        charset: 'utf8mb4_unicode_ci',
    },
    logging: config.logging,
});
