import * as Request from 'supertest';
import * as bcrypt from 'bcrypt';
import { TestApp } from '../setup';
import { ResponseCode } from '../../enums/response.enums';
import { UserEntity } from '../../entity/User.entity';
import { SubscriberEntity } from '../../entity/Subscriber.entity';

describe('Subscriber tests', () => {
    let token;
    let savedEmail;

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

    it('save subscriber with unsupported email format', async () => {
        const response = await Request(TestApp.koaInstance.callback()).post('/api/subscriber').send({ email: 'subscriber@gmail.xyz' });
        expect(response.status).toEqual(ResponseCode.BAD_REQUEST);
    });

    it('save subscriber', async () => {
        const response = await Request(TestApp.koaInstance.callback()).post('/api/subscriber').send({ email: 'subscriber@gmail.com' });
        expect(response.status).toEqual(ResponseCode.CREATED);
        savedEmail = await SubscriberEntity.find();
        expect(savedEmail).toBeInstanceOf(Array);
        expect(savedEmail.length).toBeGreaterThan(0);
        expect(savedEmail[0].email).toEqual('subscriber@gmail.com');
    });

    it('fetch all email subscribers', async () => {
        const response = await Request(TestApp.koaInstance.callback()).get('/api/subscriber').set('token', token);
        expect(response.status).toEqual(ResponseCode.OK);
        expect(response.body).toBeInstanceOf(Array);
    });

    it('delete subscriber', async () => {
        const response = await Request(TestApp.koaInstance.callback()).delete(`/api/subscriber/${savedEmail[0].id}`).set('token', token);
        expect(response.status).toEqual(ResponseCode.ACCEPTED);
        expect(response.body).toBeDefined();
        const deletedSubscriber = await SubscriberEntity.findOne({ where: { id: response.body.id } });
        expect(deletedSubscriber).toBeNull();
    });
});
