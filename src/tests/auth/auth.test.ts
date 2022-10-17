import { App } from '../../bootstrap';
import * as Request from 'supertest';
import { IMemoryDb, newDb } from 'pg-mem';
import { configService } from '../../config';
import { RegisteredEntities } from '../../entity';
import { ResponseCode } from '../../enums/response.enums';
import { DataSource } from 'typeorm';

describe('Authentication', () => {
  let TestApp: App;
  let TestDB: IMemoryDb;
  let TestDataSource: DataSource;

  beforeAll(async () => {
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
      if (
        queryText.search(
          /(pg_views|pg_matviews|pg_tables|pg_enum|columns.*|ALTER TABLE)/g,
        ) > -1
      ) {
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

    TestApp = await new App(
      configService(RegisteredEntities, '../env.test.yml'),
      TestDataSource,
    ).initApp({ enableKoaLogger: false });
  });

  it('fails unknown user sign in', async () => {
    const email = 'test@gmail.com';
    const password = 'test';

    const response = await Request(TestApp.koaInstance.callback())
      .post('/login')
      .send({ email, password });

    expect(response.status).toEqual(ResponseCode.UNAUTHORIZED);
  });

  afterAll(() => {
    TestApp.koaServer.close();
  });
});
