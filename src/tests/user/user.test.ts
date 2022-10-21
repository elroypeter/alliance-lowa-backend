import * as Request from 'supertest';
import * as bcrypt from 'bcrypt';
import { TestApp } from '../setup';
import { ResponseCode } from '../../enums/response.enums';
import { UserEntity } from '../../entity/User.entity';
import { SubscriberEntity } from '../../entity/Subscriber.entity';

describe('User Account tests', () => {
    let token;
    let users;

    beforeAll(async () => {
        const email = 'test@gmail.com';
        const password = 'test';
        const hashPassword = await bcrypt.hash(password, 10);

        const user = UserEntity.create({
            email,
            password: hashPassword,
            name: 'John',
        });
        await user.save();

        const loginResponse = await Request(TestApp.koaInstance.callback()).post('/auth/login').send({ email: 'test@gmail.com', password: 'test' });
        expect(loginResponse.status).toEqual(ResponseCode.OK);
        expect(loginResponse.body.token).toBeDefined();
        token = loginResponse.body.token;
    });

    it('save user account', async () => {
        const newUser = {
            name: 'Kenneth Meo',
            email: 'test@gmail.com',
            password: 'test',
        };
        const response = await Request(TestApp.koaInstance.callback()).post('/api/user').send(newUser);
        expect(response.status).toEqual(ResponseCode.BAD_REQUEST);
    });

    it('save user account', async () => {
        const newUser = {
            name: 'Kenneth Meo',
            email: 'kenneth@gmail.com',
            password: 'test',
        };
        const response = await Request(TestApp.koaInstance.callback()).post('/api/user').send(newUser);
        expect(response.status).toEqual(ResponseCode.CREATED);
        users = await UserEntity.find();
        expect(users).toBeInstanceOf(Array);
        expect(users.length).toBeGreaterThan(0);
        expect(users[1].email).toEqual('kenneth@gmail.com');
    });

    it('fetch all user account', async () => {
        const response = await Request(TestApp.koaInstance.callback()).get('/api/user').set('token', token);
        expect(response.status).toEqual(ResponseCode.OK);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(1);
    });

    it('delete user account', async () => {
        const response = await Request(TestApp.koaInstance.callback()).delete(`/api/user/${users[1].id}`).set('token', token);
        expect(response.status).toEqual(ResponseCode.ACCEPTED);
        expect(response.body).toBeDefined();
        const deletedUser = await SubscriberEntity.findOne({ where: { id: response.body.id } });
        expect(deletedUser).toBeNull();
    });
});
