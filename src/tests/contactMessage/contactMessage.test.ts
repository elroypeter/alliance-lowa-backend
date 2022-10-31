import * as Request from 'supertest';
import * as bcrypt from 'bcrypt';
import { TestApp } from '../setup';
import { ResponseCode } from '../../enums/response.enums';
import { UserEntity } from '../../entity/User.entity';
import { ContactMessageEntity } from '../../entity/ContactMessage.entity';

describe('Contact Message test', () => {
    let token;
    let savedContactMessages;

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

    it('save contact message', async () => {
        const contactMessage = {
            email: 'test@gmail.com',
            mobile: '06474758758',
            name: 'Jase Doe',
            message: 'test',
        };

        const response = await Request(TestApp.koaInstance.callback()).post('/api/contact-message').send(contactMessage);
        expect(response.status).toEqual(ResponseCode.CREATED);
        const savedMessage = await ContactMessageEntity.find();
        expect(savedMessage).toBeInstanceOf(Array);
        expect(savedMessage.length).toBeGreaterThan(0);
        expect(savedMessage[0].email).toEqual('test@gmail.com');
    });

    it('fetch all contact message', async () => {
        savedContactMessages = await Request(TestApp.koaInstance.callback()).get('/api/contact-message').set('token', token);
        expect(savedContactMessages.status).toEqual(ResponseCode.OK);
        expect(savedContactMessages.body).toBeInstanceOf(Array);
        expect(savedContactMessages.body.length).toBeGreaterThan(0);
    });

    it('fetch single contact message', async () => {
        const response = await Request(TestApp.koaInstance.callback())
            .get(`/api/contact-message/${savedContactMessages.body[0].id}`)
            .set('token', token);
        expect(response.status).toEqual(ResponseCode.OK);
        expect(response.body.id).toEqual(savedContactMessages.body[0].id);
    });

    it('delete contact message', async () => {
        const response = await Request(TestApp.koaInstance.callback())
            .delete(`/api/contact-message/${savedContactMessages.body[0].id}`)
            .set('token', token);
        expect(response.status).toEqual(ResponseCode.ACCEPTED);
        expect(response.body).toBeDefined();
        const deletedMessage = await ContactMessageEntity.findOne({ where: { id: response.body.id } });
        expect(deletedMessage).toBeNull();
    });
});
