import * as Request from 'supertest';
import * as bcrypt from 'bcrypt';
import { TestApp } from '../setup';
import { ResponseCode } from '../../enums/response.enums';
import { UserEntity } from '../../entity/User.entity';
import { IImageSliderDto } from 'src/interface/image-slider.interface';
import { DeleteFile } from '../../services/ManageFile.service';

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

    it('save image slider', async () => {
        const loginResponse = await Request(TestApp.koaInstance.callback()).post('/auth/login').send({ email: 'test@gmail.com', password: 'test' });
        expect(loginResponse.status).toEqual(ResponseCode.OK);
        expect(loginResponse.body.token).toBeDefined();
        const token = loginResponse.body.token;

        const newImageSlider: IImageSliderDto = {
            langCode: 'en',
            title: 'Alliance Lowa',
            description: 'Show activity on this post',
            base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII',
        };

        const imageResponse = await Request(TestApp.koaInstance.callback()).post('/api/image-slider').set('token', token).send(newImageSlider);
        expect(imageResponse.status).toEqual(ResponseCode.CREATED);
        expect(imageResponse.body).toBeInstanceOf(Array);
        expect(imageResponse.body.length).toBeGreaterThan(0);

        await DeleteFile(imageResponse.body[0].filePath);
    });
});
