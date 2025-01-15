import { DataSource, DataSourceOptions } from 'typeorm';

import { configService } from '../config';
import { RegisteredEntities } from 'src/entity';

const config = configService(RegisteredEntities);

export const TypeOrmDataSource = new DataSource({
    ...(config.app_data_source as DataSourceOptions),
    migrationsTableName: 'migrations',
} as unknown as DataSourceOptions);
