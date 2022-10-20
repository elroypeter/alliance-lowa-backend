import * as Request from 'supertest';
import * as bcrypt from 'bcrypt';
import { TestApp } from '../setup';
import { ResponseCode } from '../../enums/response.enums';
import { UserEntity } from '../../entity/User.entity';
import { CareerEntity } from '../../entity/Career.entity';

describe('Careers tests', () => {
    let token;
    let savedCareers;

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

    it('save careers', async () => {
        const newCareer = {
            title: 'New Job',
            description: 'testing new jobs',
        };

        const response = await Request(TestApp.koaInstance.callback()).post('/api/careers').set('token', token).send(newCareer);
        expect(response.status).toEqual(ResponseCode.CREATED);
        const savedCareer = await CareerEntity.find();
        expect(savedCareer).toBeInstanceOf(Array);
        expect(savedCareer.length).toBeGreaterThan(0);
        expect(savedCareer[0].slug).toEqual('new-job');
    });

    it('fetch all careers', async () => {
        const response = await Request(TestApp.koaInstance.callback()).get('/api/careers').set('token', token);
        savedCareers = response.body[0];
        expect(response.status).toEqual(ResponseCode.OK);
        expect(response.body).toBeInstanceOf(Array);
    });

    it('fetch all careers public', async () => {
        const response = await Request(TestApp.koaInstance.callback()).get('/api/public/careers');
        expect(response.status).toEqual(ResponseCode.OK);
        expect(response.body).toBeInstanceOf(Array);
    });

    it('fetch single career', async () => {
        const response = await Request(TestApp.koaInstance.callback()).get(`/api/careers/${savedCareers.id}`).set('token', token);
        expect(response.status).toEqual(ResponseCode.OK);
        expect(response.body.id).toEqual(savedCareers.id);
    });

    it('fetch single career public', async () => {
        const response = await Request(TestApp.koaInstance.callback()).get(`/api/public/careers/${savedCareers.id}`);
        expect(response.status).toEqual(ResponseCode.OK);
        expect(response.body.id).toEqual(savedCareers.id);
    });

    it('update career', async () => {
        const updateCareer = {
            title: 'Update Job',
            description: 'testing new jobs',
        };

        const response = await Request(TestApp.koaInstance.callback()).put(`/api/careers/${savedCareers.id}`).set('token', token).send(updateCareer);
        expect(response.status).toEqual(ResponseCode.ACCEPTED);
        const career = await CareerEntity.findOne({ where: { id: savedCareers.id } });
        expect(career.title).toEqual('Update Job');
    });

    it('delete career', async () => {
        const response = await Request(TestApp.koaInstance.callback()).delete(`/api/careers/${savedCareers.id}`).set('token', token);
        expect(response.status).toEqual(ResponseCode.ACCEPTED);
        expect(response.body).toBeDefined();
        const deletedCareer = await CareerEntity.findOne({ where: { id: response.body.id } });
        expect(deletedCareer).toBeNull();
    });
});
