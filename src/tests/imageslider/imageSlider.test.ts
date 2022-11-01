import * as Request from 'supertest';
import * as bcrypt from 'bcrypt';
import { TestApp } from '../setup';
import { ResponseCode } from '../../enums/response.enums';
import { UserEntity } from '../../entity/User.entity';
import { DeleteFile } from '../../services/ManageFile.service';
import { ImageSliderEntity } from '../../entity/ImageSlider.entity';
import { ImageSliderTranslationEntity } from '../../entity/ImageSliderTranslation.entity';

describe('ImageSider test', () => {
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
    });

    it('save image slider', async () => {
        const newImageSlider = {
            langCode: 'en',
            title: 'en Alliance Lowa',
            description: 'en Show activity on this post',
            base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII',
        };

        const response = await Request(TestApp.koaInstance.callback()).post('/api/image-slider').set('token', token).send(newImageSlider);
        expect(response.status).toEqual(ResponseCode.CREATED);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
        selectedImage = response.body[0];
        expect(selectedImage.isPublished.status).toBeFalsy();
        await DeleteFile(selectedImage.filePath);
    });

    it('access image sliders with isPublished query', async () => {
        const response = await Request(TestApp.koaInstance.callback()).get('/api/image-slider').query({ isPublished: true }).set('token', token);
        expect(response.status).toEqual(ResponseCode.OK);
    });

    it('access public endpoint image sliders with isPublished query', async () => {
        const response = await Request(TestApp.koaInstance.callback()).get('/api/public/image-slider').query({ isPublished: true });
        expect(response.status).toEqual(ResponseCode.OK);
    });

    it('access image sliders with query', async () => {
        const response = await Request(TestApp.koaInstance.callback()).get('/api/image-slider').query({ isPublished: false }).set('token', token);
        expect(response.status).toEqual(ResponseCode.OK);
    });

    it('add image slider translation', async () => {
        const newTranslation = {
            langCode: 'de',
            title: 'de Alliance Lowa',
            description: 'de Show activity on this post',
        };
        const response = await Request(TestApp.koaInstance.callback())
            .post(`/api/image-slider/translation/${selectedImage.id}`)
            .set('token', token)
            .send(newTranslation);
        expect(response.status).toEqual(ResponseCode.CREATED);
    });

    it('access public endpoint image sliders with isPublished query', async () => {
        const response = await Request(TestApp.koaInstance.callback()).get('/api/public/image-slider').query({ langCode: 'de' });
        expect(response.status).toEqual(ResponseCode.OK);
    });

    it('update image slider translation', async () => {
        const updateTranslation = {
            title: 'Updated Alliance Lowa',
            description: 'Show activity on this post',
        };

        const response = await Request(TestApp.koaInstance.callback())
            .put(`/api/image-slider/translation/${selectedImage.translations[0].id}`)
            .set('token', token)
            .send(updateTranslation);
        expect(response.status).toEqual(ResponseCode.CREATED);
        const updatedImageTranslation = await ImageSliderTranslationEntity.findOne({ where: { id: response.body.id } });
        expect(updatedImageTranslation.title).toEqual('Updated Alliance Lowa');
    });

    it('publish image slider', async () => {
        const response = await Request(TestApp.koaInstance.callback()).put(`/api/image-slider/publish/${selectedImage.id}`).set('token', token).send({
            status: true,
        });
        expect(response.status).toEqual(ResponseCode.ACCEPTED);
        expect(response.body).toBeDefined();
        const publishedImage = await ImageSliderEntity.findOne({ where: { id: response.body.id }, relations: ['isPublished'] });
        expect(publishedImage.isPublished.status).toBeTruthy();
    });

    it('delete image slider', async () => {
        const response = await Request(TestApp.koaInstance.callback()).delete(`/api/image-slider/${selectedImage.id}`).set('token', token);
        expect(response.status).toEqual(ResponseCode.ACCEPTED);
        expect(response.body).toBeDefined();
        const deletedImage = await ImageSliderEntity.findOne({ where: { id: response.body.id } });
        expect(deletedImage).toBeNull();
    });
});
