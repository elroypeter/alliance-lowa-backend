import { DataSource, DataSourceOptions } from 'typeorm';

import { configService } from '../config';
import { RegisteredEntities } from 'src/entity';

const config = configService(RegisteredEntities);

const migrationSource = {
    testing: ['src/**/seeds/*{.ts,.js}'],
    development: ['src/**/seeds/*{.ts,.js}'],
    production: ['dist/src/database/seeds/*{.ts,.js}'],
};

export const TypeOrmDataSource = new DataSource({
    ...(config.app_data_source as DataSourceOptions),
    migrations: migrationSource[config.app_env],
    migrationsTableName: 'seed-migrations',
} as DataSourceOptions);
