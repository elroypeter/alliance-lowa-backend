import { App } from '../../bootstrap';
import * as Request from 'supertest';
import * as bcrypt from 'bcrypt';
import { ResponseCode } from '../../enums/response.enums';
import { TestAppInstance } from '../setup';
import { UserEntity } from '../../entity/User.entity';

describe('Authentication', () => {
  let TestApp: App;

  beforeAll(async () => {
    TestApp = await TestAppInstance();

    const email = 'test@gmail.com';
    const password = 'test';
    const hashPassword = await bcrypt.hash(password, 10);

    const user = UserEntity.create({
      email,
      password: hashPassword,
      name: 'John',
    });
    await user.save();
  });

  it('unknown user fails to sign-in', async () => {
    const response = await Request(TestApp.koaInstance.callback())
      .post('/login')
      .send({ email: 'unknown@gmail.com', password: 'test' });

    expect(response.status).toEqual(ResponseCode.UNAUTHORIZED);
    expect(response.text).toEqual('User with email not found');
  });

  it('user signs in successfully', async () => {
    const response = await Request(TestApp.koaInstance.callback())
      .post('/login')
      .send({ email: 'test@gmail.com', password: 'test' });
    expect(response.status).toEqual(ResponseCode.OK);
  });

  it('user cannot sign in with invalid password', async () => {
    const response = await Request(TestApp.koaInstance.callback())
      .post('/login')
      .send({ email: 'test@gmail.com', password: '2test2' });
    expect(response.status).toEqual(ResponseCode.UNAUTHORIZED);
    expect(response.text).toEqual('Invalid user password');
  });

  afterAll(() => {
    TestApp.koaServer.close();
  });
});
