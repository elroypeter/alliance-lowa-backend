import * as Request from 'supertest';
import * as bcrypt from 'bcrypt';
import { TestApp } from '../setup';
import { ResponseCode } from '../../enums/response.enums';
import { UserEntity } from '../../entity/User.entity';
import { DeleteFile } from '../../services/ManageFile.service';
import { BlogNewsTranslationEntity } from '../../entity/BlogNewsTranslation.entity';
import { BlogNewsEntity } from '../../entity/BlogNews.entity';

describe('Blog News test', () => {
    let token;
    let selectedBlog;

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

    it('unauthenticated access of blog news', async () => {
        const response = await Request(TestApp.koaInstance.callback()).get('/api/blog-news').send({});
        expect(response.status).toEqual(ResponseCode.BAD_REQUEST);
        expect(response.text).toEqual('token is required for authentication');
    });

    it('authenticated access of blog news', async () => {
        const response = await Request(TestApp.koaInstance.callback()).get('/api/blog-news').set('token', token);
        expect(response.status).toEqual(ResponseCode.OK);
        expect(response.body).toBeInstanceOf(Array);
    });

    it('access public of blog news list', async () => {
        const response = await Request(TestApp.koaInstance.callback()).get('/api/blog-news/public');
        expect(response.status).toEqual(ResponseCode.OK);
        expect(response.body).toBeInstanceOf(Array);
    });

    it('save new blog news', async () => {
        const newBlog = {
            langCode: 'en',
            title: 'Alliance Lowa',
            description: 'Show activity on this post',
            base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII',
        };

        const response = await Request(TestApp.koaInstance.callback()).post('/api/blog-news').set('token', token).send(newBlog);
        expect(response.status).toEqual(ResponseCode.CREATED);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
        selectedBlog = response.body[0];
        expect(selectedBlog.isPublished.status).toBeFalsy();
        await DeleteFile(selectedBlog.filePath);
    });

    it('access private of blog news single', async () => {
        const response = await Request(TestApp.koaInstance.callback()).get(`/api/blog-news/${selectedBlog.body[0].id}`).set('token', token);
        expect(response.status).toEqual(ResponseCode.OK);
        expect(response.body.id).toEqual(selectedBlog.body[0].id);
    });

    it('access public of blog news single', async () => {
        const response = await Request(TestApp.koaInstance.callback()).get(`/api/blog-news/public/${selectedBlog.body[0].id}`);
        expect(response.status).toEqual(ResponseCode.OK);
        expect(response.body.id).toEqual(selectedBlog.body[0].id);
    });

    it('access blog news with true isPublished query', async () => {
        const response = await Request(TestApp.koaInstance.callback()).get('/api/blog-news').query({ isPublished: true }).set('token', token);
        expect(response.status).toEqual(ResponseCode.OK);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toEqual(0);
    });

    it('access blog news with false isPublished query', async () => {
        const response = await Request(TestApp.koaInstance.callback()).get('/api/blog-news').query({ isPublished: false }).set('token', token);
        expect(response.status).toEqual(ResponseCode.OK);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toEqual(1);
    });

    it('add blog news translation', async () => {
        const newTranslation = {
            langCode: 'de',
            title: 'Alliance Lowa',
            description: 'Show activity on this post',
        };
        const response = await Request(TestApp.koaInstance.callback())
            .post(`/api/blog-news/translation/${selectedBlog.id}`)
            .set('token', token)
            .send(newTranslation);
        expect(response.status).toEqual(ResponseCode.CREATED);
        expect(response.body.translations).toBeInstanceOf(Array);
        expect(response.body.translations.length).toBeGreaterThan(1);
    });

    it('update blog news translation', async () => {
        const updateTranslation = {
            title: 'Updated Alliance Lowa',
            description: 'Show activity on this post',
        };

        const response = await Request(TestApp.koaInstance.callback())
            .put(`/api/blog-news/translation/${selectedBlog.translations[0].id}`)
            .set('token', token)
            .send(updateTranslation);
        expect(response.status).toEqual(ResponseCode.CREATED);
        const updatedBlogTranslation = await BlogNewsTranslationEntity.findOne({ where: { id: response.body.id } });
        expect(updatedBlogTranslation.title).toEqual('Updated Alliance Lowa');
    });

    it('publish blog news', async () => {
        const response = await Request(TestApp.koaInstance.callback()).put(`/api/blog-news/publish/${selectedBlog.id}`).set('token', token).send({
            status: true,
        });
        expect(response.status).toEqual(ResponseCode.ACCEPTED);
        expect(response.body).toBeDefined();
        const publishedBlog = await BlogNewsEntity.findOne({ where: { id: response.body.id }, relations: ['isPublished'] });
        expect(publishedBlog.isPublished.status).toBeTruthy();
    });

    it('delete blog news', async () => {
        const response = await Request(TestApp.koaInstance.callback()).delete(`/api/blog-news/${selectedBlog.id}`).set('token', token);
        expect(response.status).toEqual(ResponseCode.ACCEPTED);
        expect(response.body).toBeDefined();
        const deletedBlog = await BlogNewsEntity.findOne({ where: { id: response.body.id } });
        expect(deletedBlog).toBeNull();
    });
});
