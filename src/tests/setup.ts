import { App } from '../bootstrap';
import { DataSource } from 'typeorm';
import { IMemoryDb, newDb } from 'pg-mem';
import { configService } from '../config';
import { RegisteredEntities } from '../entity';

export let TestApp: App;
let TestDB: IMemoryDb;
let TestDataSource: DataSource;

beforeAll(async () => {
    TestApp = await TestAppInstance();
});

beforeEach(async () => {
    jest.clearAllMocks();
});

afterAll(async () => {
    await TestApp.koaServer.close();
});

const TestAppInstance = async (): Promise<App> => {
    TestDB = newDb({
        autoCreateForeignKeyIndices: true,
    });

    TestDB.public.registerFunction({
        implementation: () => 'test',
        name: 'current_database',
    });

    TestDB.public.registerFunction({
        implementation: () => 'test',
        name: 'version',
    });

    TestDB.public.interceptQueries((queryText) => {
        if (queryText.search(/(pg_views|pg_matviews|pg_tables|pg_enum|columns.*|ALTER TABLE)/g) > -1) {
            return [];
        }
        return null;
    });

    TestDataSource = await TestDB.adapters.createTypeormDataSource({
        type: 'postgres',
        database: ':memory:',
        dropSchema: true,
        entities: RegisteredEntities,
        synchronize: true,
        logging: false,
    });

    TestDataSource = await TestDataSource.initialize();
    TestApp = await new App(configService(RegisteredEntities, '../env.test.yml'), TestDataSource).initApp({ enableKoaLogger: false });
    return TestApp;
};
