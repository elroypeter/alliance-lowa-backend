import * as Request from 'supertest';
import * as bcrypt from 'bcrypt';
import { TestApp } from '../setup';
import { ResponseCode } from '../../enums/response.enums';
import { UserEntity } from '../../entity/User.entity';
import { DeleteFile } from '../../services/ManageFile.service';

describe('ImageSider', () => {
    let token;
    let selectedImage;

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

    it('unauthenticated access of image slider', async () => {
        const response = await Request(TestApp.koaInstance.callback()).get('/api/image-slider').send({});
        expect(response.status).toEqual(ResponseCode.BAD_REQUEST);
        expect(response.text).toEqual('token is required for authentication');
    });

    it('authenticated access of image slider', async () => {
        const response = await Request(TestApp.koaInstance.callback()).get('/api/image-slider').set('token', token);
        expect(response.status).toEqual(ResponseCode.OK);
        expect(response.body).toBeInstanceOf(Array);
    });

    it('save image slider', async () => {
        const newImageSlider = {
            langCode: 'en',
            title: 'Alliance Lowa',
            description: 'Show activity on this post',
            base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII',
        };

        const response = await Request(TestApp.koaInstance.callback()).post('/api/image-slider').set('token', token).send(newImageSlider);
        expect(response.status).toEqual(ResponseCode.CREATED);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
        selectedImage = response.body[0];
        await DeleteFile(selectedImage.filePath);
    });

    it('add image slider translation', async () => {
        const newTranslation = {
            langCode: 'de',
            title: 'Alliance Lowa',
            description: 'Show activity on this post',
        };
        const response = await Request(TestApp.koaInstance.callback()).put(`/api/image-slider/${selectedImage.id}`).set('token', token).send(newTranslation);
        expect(response.status).toEqual(ResponseCode.CREATED);
        expect(response.body.translations).toBeInstanceOf(Array);
        expect(response.body.translations.length).toBeGreaterThan(1);
    });
});
