import * as Request from 'supertest';
import * as bcrypt from 'bcrypt';
import { TestApp } from '../setup';
import { ResponseCode } from '../../enums/response.enums';
import { UserEntity } from '../../entity/User.entity';

describe('ImageSider', () => {
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
    });

    it('unauthenticated access of image slider', async () => {
        const response = await Request(TestApp.koaInstance.callback()).get('/api/image-slider').send({});

        expect(response.status).toEqual(ResponseCode.BAD_REQUEST);
        expect(response.text).toEqual('token is required for authentication');
    });

    it('authenticated access of image slider', async () => {
        const loginResponse = await Request(TestApp.koaInstance.callback()).post('/auth/login').send({ email: 'test@gmail.com', password: 'test' });
        expect(loginResponse.status).toEqual(ResponseCode.OK);
        expect(loginResponse.body.token).toBeDefined();
        const token = loginResponse.body.token;

        const imageResponse = await Request(TestApp.koaInstance.callback()).get('/api/image-slider').set('token', token);
        expect(imageResponse.status).toEqual(ResponseCode.OK);
        expect(imageResponse.body).toBeInstanceOf(Array);
    });
});
